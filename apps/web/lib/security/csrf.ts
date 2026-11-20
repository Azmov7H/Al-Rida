import { cookies, headers } from "next/headers"
import { randomBytes, timingSafeEqual } from "crypto"
import { NextResponse } from "next/server"

export const CSRF_COOKIE = "csrf-token"
const HEADER = "x-csrf-token"
const FIELD = "csrfToken"

export function generateCsrfToken(): string {
  return randomBytes(32).toString("base64url")
}

/** Set the readable CSRF cookie. Call from Server Components / route handlers. */
export async function issueCsrfCookie(): Promise<void> {
  const store = await cookies()
  if (!store.get(CSRF_COOKIE)) {
    store.set(CSRF_COOKIE, generateCsrfToken(), {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    })
  }
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

function isSafeMethod(method: string): boolean {
  return ["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())
}

/**
 * Double-submit CSRF check for Route Handlers (API routes).
 * The token is read from the `x-csrf-token` header and compared to the
 * readable `csrf-token` cookie. Cookie is HttpOnly=false so JS can read it
 * and attach the header. Combined with SameSite=Lax this blocks cross-site
 * POSTs that cannot read/echo the cookie.
 */
export async function verifyCsrfForRequest(request: Request): Promise<boolean> {
  if (isSafeMethod(request.method)) return true

  const store = await cookies()
  const cookieToken = store.get(CSRF_COOKIE)?.value
  const headerToken = request.headers.get(HEADER)
  if (!cookieToken || !headerToken) return false
  return constantTimeEqual(cookieToken, headerToken)
}

/**
 * CSRF check for Server Actions. The token is submitted as a hidden form
 * field `csrfToken` (or `x-csrf-token` header when invoked programmatically).
 */
export async function verifyCsrfForAction(formData: FormData): Promise<boolean> {
  const store = await cookies()
  const cookieToken = store.get(CSRF_COOKIE)?.value
  const submitted =
    (formData.get(FIELD) as string | null) ??
    (await headers()).get(HEADER)
  if (!cookieToken || !submitted) return false
  return constantTimeEqual(cookieToken, submitted)
}

export function csrfFailure(): NextResponse {
  return NextResponse.json(
    { success: false, message: "Invalid CSRF token.", errors: [] },
    { status: 403 },
  )
}
