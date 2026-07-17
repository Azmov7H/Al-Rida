import { orderRepository } from "@/repositories/order.repository"
import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, notFound, serverError } from "@/lib/responses"
import { orderStatusSchema } from "@/validators/order"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const { id } = await params
  const parsed = orderStatusSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const order = await orderRepository.updateStatus(id, parsed.data)
    if (!order) return notFound("Order not found.")
    return ok(order)
  } catch {
    return serverError()
  }
}
