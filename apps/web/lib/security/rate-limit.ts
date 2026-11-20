import { logger } from "@/lib/logger"

interface Bucket {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

const WINDOW_MS = 60_000

function sweep(now: number) {
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key)
  }
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  retryAfter: number
}

/**
 * In-memory sliding-fixed-window rate limiter.
 * No external dependency (Redis not in stack). Resets per server instance —
 * acceptable for single-instance deployments; swap for Redis on horizontal scale.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number = WINDOW_MS,
): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const resetAt = now + windowMs
  const existing = store.get(key)

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt })
    return { success: true, limit, remaining: limit - 1, retryAfter: 0 }
  }

  const bucket = existing
  if (bucket.count >= limit) {
    logger.warn("rate_limit_exceeded", { key, limit, windowMs })
    return {
      success: false,
      limit,
      remaining: 0,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }

  bucket.count += 1
  return {
    success: true,
    limit,
    remaining: limit - bucket.count,
    retryAfter: 0,
  }
}

export function rateLimitKey(prefix: string, identifier: string): string {
  return `rl:${prefix}:${identifier}`
}

export function clientKey(prefix: string, request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")
  const ip = fwd?.split(",")[0]?.trim() ?? "unknown"
  return rateLimitKey(prefix, ip)
}
