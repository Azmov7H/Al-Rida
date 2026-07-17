import bcrypt from "bcryptjs"
import { userRepository } from "@/repositories/user.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
})

export async function PATCH(request: Request) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const user = await userRepository.findById(guard.session.id)
    if (!user || !user.passwordHash) return badRequest("No password set.")
    const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)
    if (!valid) return badRequest("Current password is incorrect.")
    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12)
    await userRepository.update(guard.session.id, { passwordHash })
    return ok(null, "Password updated.")
  } catch {
    return serverError()
  }
}
