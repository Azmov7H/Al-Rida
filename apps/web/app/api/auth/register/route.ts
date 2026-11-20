import { authService } from "@/services/auth.service"
import { createSession } from "@/lib/auth/session"
import { registerSchema } from "@/validators/auth"
import { ok, badRequest, serverError, forbidden } from "@/lib/responses"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.flatten())
    }
    if (parsed.data.password !== parsed.data.confirmPassword) {
      return forbidden("Passwords do not match.")
    }
    const user = await authService.register(parsed.data)
    await createSession({
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    })
    return ok({ id: String(user._id), email: user.email, name: user.name })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed."
    if (message.includes("already registered")) {
      return forbidden(message)
    }
    return serverError(message)
  }
}
