import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET ?? "change-me"
const COOKIE_NAME = "session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface SessionPayload {
  id: string
  email: string
  name: string
  role: "customer" | "manager" | "admin"
}

export async function createSession(payload: SessionPayload) {
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" })
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
  try {
    return jwt.verify(token, SECRET) as SessionPayload
  } catch {
    return null
  }
}

export async function destroySession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
