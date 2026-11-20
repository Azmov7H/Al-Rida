import { cartRepository } from "@/repositories/cart.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({ quantity: z.number().int().min(1) })

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const { id } = await params
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const cart = await cartRepository.getByUser(guard.session.id)
    if (!cart) return ok(null)
    const item = cart.items.find((i) => i.product.toString() === id)
    if (item) item.quantity = parsed.data.quantity
    await cartRepository.setItems(
      guard.session.id,
      cart.items.map((i) => ({ product: i.product.toString(), quantity: i.quantity })),
    )
    return ok(cart)
  } catch {
    return serverError()
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const { id } = await params
  try {
    const cart = await cartRepository.getByUser(guard.session.id)
    if (!cart) return ok(null)
    const items = cart.items
      .filter((i) => i.product.toString() !== id)
      .map((i) => ({ product: i.product.toString(), quantity: i.quantity }))
    await cartRepository.setItems(guard.session.id, items)
    return ok(null, "Item removed.")
  } catch {
    return serverError()
  }
}
