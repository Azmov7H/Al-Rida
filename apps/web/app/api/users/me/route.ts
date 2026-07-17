import { userRepository } from "@/repositories/user.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, serverError } from "@/lib/responses"

export async function GET() {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  try {
    const user = await userRepository.findById(guard.session.id)
    if (!user) return ok(null)
    return ok({ id: String(user._id), email: user.email, name: user.name, role: user.role })
  } catch {
    return serverError()
  }
}

export async function PATCH(request: Request) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  try {
    const body = await request.json().catch(() => ({}))
    const { name, email } = body
    const update: Record<string, unknown> = {}
    if (typeof name === "string") update.name = name
    if (typeof email === "string") update.email = email
    const user = await userRepository.update(guard.session.id, update)
    return ok({ id: String(user?._id), name: user?.name, email: user?.email })
  } catch {
    return serverError()
  }
}

export async function DELETE() {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  try {
    await userRepository.remove(guard.session.id)
    return ok(null, "Account deleted.")
  } catch {
    return serverError()
  }
}
