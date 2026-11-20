import { orderRepository } from "@/repositories/order.repository"
import { requireUser, requireRole } from "@/lib/auth/guard"
import { ok, notFound, serverError } from "@/lib/responses"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const { id } = await params
  try {
    const order = await orderRepository.findById(id)
    if (!order) return notFound("Order not found.")
    return ok(order)
  } catch {
    return serverError()
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const { status, paymentStatus, notes } = body
  try {
    const update: Record<string, unknown> = {}
    if (status) update.status = status
    if (paymentStatus) update.paymentStatus = paymentStatus
    if (notes) update.notes = notes
    const order = await orderRepository.updateFields(id, update)
    if (!order) return notFound("Order not found.")
    return ok(order)
  } catch {
    return serverError()
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole("admin")
  if ("response" in guard) return guard.response
  const { id } = await params
  try {
    await orderRepository.remove(id)
    return ok(null, "Order deleted.")
  } catch {
    return serverError()
  }
}
