import { orderRepository } from "@/repositories/order.repository"
import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, notFound, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({ paymentStatus: z.enum(["unpaid", "paid", "partially_paid", "refunded", "failed"]) })

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const { id } = await params
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const order = await orderRepository.updateFields(id, { paymentStatus: parsed.data.paymentStatus })
    if (!order) return notFound("Order not found.")
    return ok(order)
  } catch {
    return serverError()
  }
}
