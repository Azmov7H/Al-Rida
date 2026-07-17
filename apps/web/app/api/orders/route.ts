import { orderService } from "@/services/order.service"
import { requireUser } from "@/lib/auth/guard"
import { ok, created, badRequest, serverError } from "@/lib/responses"
import { checkoutSchema } from "@/validators/order"

export async function GET() {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  try {
    return ok(await orderService.listForUser(guard.session.id))
  } catch {
    return serverError()
  }
}

export async function POST(request: Request) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const order = await orderService.checkout(guard.session.id, parsed.data)
    return created({ orderNumber: order.orderNumber, status: order.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order failed."
    return badRequest(message)
  }
}
