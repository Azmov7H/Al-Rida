import { wishlistRepository } from "@/repositories/wishlist.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, serverError } from "@/lib/responses"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const { id } = await params
  try {
    return ok(await wishlistRepository.remove(guard.session.id, id))
  } catch {
    return serverError()
  }
}
