import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"
import { orderRepository } from "@/repositories/order.repository"

const schema = z.object({ orderNumber: z.string().min(1) })

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const order = await orderRepository.markPaid(parsed.data.orderNumber)
    if (!order) return badRequest("Order not found.")
    return ok({ status: order.status, paymentStatus: order.paymentStatus })
  } catch {
    return serverError()
  }
}
