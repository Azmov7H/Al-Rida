import { connectDB } from "@/lib/db"
import { RateLimitBucket } from "@/models/rate-limit"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  retryAfter: number
}

/**
 * Rate limiter — MongoDB-backed buckets (shared across instances; no new deps).
 * Sliding-window with per-key buckets. Redis-backed upgrade path (documented
 * in RISKS_AND_MIGRATION.md).
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number = 60_000,
): Promise<RateLimitResult> {
  await connectDB()
  const now = Date.now()
  const resetAt = now + windowMs

  const existing = await RateLimitBucket.findOne({ key })
  if (existing) {
    if (existing.resetAt <= now) {
      // window expired — reset
      await RateLimitBucket.updateOne({ key }, { $set: { resetAt, count: 1 } })
      return { success: true, limit, remaining: limit - 1, retryAfter: 0 }
    }
    if (existing.count >= limit) {
      logger.warn("rate_limit_exceeded", { key, limit, windowMs })
      await audit({ action: "rate_limit_exceeded", metadata: { key, limit } })
      return {
        success: false,
        limit,
        remaining: 0,
        retryAfter: Math.ceil((existing.resetAt - now) / 1000),
      }
    }
    await RateLimitBucket.updateOne({ key }, { $inc: { count: 1 } })
    return {
      success: true,
      limit,
      remaining: limit - existing.count - 1,
      retryAfter: 0,
    }
  }

  await RateLimitBucket.create({ key, resetAt, count: 1 })
  return { success: true, limit, remaining: limit - 1, retryAfter: 0 }
}

export function rateLimitKey(prefix: string, identifier: string): string {
  return `rl:${prefix}:${identifier}`
}

export function clientKey(prefix: string, request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")
  const ip = fwd?.split(",")[0]?.trim() ?? "unknown"
  return rateLimitKey(prefix, ip)
}
