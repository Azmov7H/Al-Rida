import { authService } from "@/services/auth.service"
import { createSession } from "@/lib/auth/session"
import { loginSchema } from "@/validators/auth"
import { ok, badRequest, unauthorized } from "@/lib/responses"
import { rateLimit, clientKey } from "@/lib/security/rate-limit"
import { verifyCsrfForRequest, csrfFailure } from "@/lib/security/csrf"
import { withErrorHandler } from "@/lib/errors"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"

async function handler(request: Request) {
  const rl = rateLimit(clientKey("api-login", request), 5, 15_000)
  if (!rl.success) {
    return unauthorized("Too many attempts.")
  }
  if (!(await verifyCsrfForRequest(request))) {
    logger.warn("csrf_failure", { route: "POST /api/auth/login" })
    return csrfFailure()
  }
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.flatten())
    }
    const user = await authService.verifyCredentials(parsed.data)
    if (!user) {
      await audit({
        actorEmail: parsed.data.email,
        actorRole: "unknown",
        action: "auth.login.failure",
        target: "auth",
      })
      return unauthorized("Invalid credentials.")
    }
    await createSession({
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    })
    await audit({
      actorId: String(user._id),
      actorEmail: user.email,
      actorRole: user.role,
      action: "auth.login.success",
      target: "auth",
    })
    return ok({ id: String(user._id), email: user.email, name: user.name })
  } catch {
    return unauthorized("Invalid credentials.")
  }
}

export const POST = withErrorHandler(handler)
