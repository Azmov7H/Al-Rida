import jwt from "jsonwebtoken"
import { randomUUID } from "node:crypto"
import { cookies } from "next/headers"
import { logger } from "@/lib/logger"
import { userRepository } from "@/repositories/user.repository"

const SECRET = process.env.JWT_SECRET ?? "change-me"
const COOKIE_NAME = "session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

if (process.env.NODE_ENV === "production" && SECRET === "change-me") {
  logger.error("auth_secret_not_set", null, {
    hint: "Set JWT_SECRET in production or sessions are insecure.",
  })
}

export interface SessionPayload {
  id: string
  email: string
  name: string
  role: "customer" | "manager" | "admin"
  /** Unique session id (revoked on logout / password change). */
  jti?: string
  /** Login time (unix seconds, set by jwt.sign). */
  iat?: number
}

/** In-memory denylist — replaced with shared storage (Redis/DB) on multi-instance. */
const revokedJtis = new Set<string>()

export function isSessionRevoked(jti?: string): boolean {
  return Boolean(jti && revokedJtis.has(jti))
}

export async function createSession(payload: SessionPayload) {
  const token = jwt.sign(
    { ...payload, jti: randomUUID() },
    SECRET,
    { expiresIn: "7d" },
  )
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return null
  let payload: SessionPayload
  try {
    payload = jwt.verify(token, SECRET) as SessionPayload
  } catch {
    return null
  }
  // Revoked session (logout or password change).
  if (payload.jti && isSessionRevoked(payload.jti)) return null
  // Password was changed since session issue → old token is invalid.
  if (payload.iat && typeof payload.iat === "number") {
    const user = await userRepository.findById(payload.id)
    if (user?.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime()) {
      return null
    }
  }
  return payload
}

function extractJti(token: string): string | undefined {
  try {
    return (jwt.verify(token, SECRET) as SessionPayload).jti
  } catch {
    return undefined
  }
}

export async function destroySession() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  const jti = token ? extractJti(token) : undefined
  store.delete(COOKIE_NAME)
  if (jti) revokedJtis.add(jti)
}
