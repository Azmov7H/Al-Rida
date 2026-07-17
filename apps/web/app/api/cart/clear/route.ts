import { cartRepository } from "@/repositories/cart.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, serverError } from "@/lib/responses"

export async function DELETE() {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  try {
    await cartRepository.clear(guard.session.id)
    return ok(null, "Cart cleared.")
  } catch {
    return serverError()
  }
}
