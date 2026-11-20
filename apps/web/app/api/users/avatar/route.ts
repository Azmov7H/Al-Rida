import { userRepository } from "@/repositories/user.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({ avatar: z.string().url() })

export async function PATCH(request: Request) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    await userRepository.update(guard.session.id, { avatar: parsed.data.avatar } as Record<string, unknown>)
    return ok(null, "Avatar updated.")
  } catch {
    return serverError()
  }
}
