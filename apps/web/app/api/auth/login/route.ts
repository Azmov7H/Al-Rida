import { authService } from "@/services/auth.service"
import { createSession } from "@/lib/auth/session"
import { loginSchema } from "@/validators/auth"
import { ok, badRequest, unauthorized } from "@/lib/responses"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.flatten())
    }
    const user = await authService.verifyCredentials(parsed.data)
    if (!user) {
      return unauthorized("Invalid credentials.")
    }
    await createSession({
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    })
    return ok({ id: String(user._id), email: user.email, name: user.name })
  } catch {
    return unauthorized("Invalid credentials.")
  }
}
