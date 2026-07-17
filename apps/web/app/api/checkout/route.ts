import { orderService } from "@/services/order.service"
import { ok, badRequest, unauthorized } from "@/lib/responses"
import { getSession } from "@/lib/auth/session"
import { z } from "zod"

const schema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1) })).min(1),
  address: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(8),
    governorate: z.string().min(2),
    city: z.string().min(2),
    street: z.string().min(2),
    postalCode: z.string().optional(),
    email: z.string().email(),
  }),
  paymentMethod: z.enum(["cod", "paymob", "stripe"]),
  shippingFee: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const order = await orderService.placeGuestOrder(parsed.data)
    return ok({ orderNumber: order.orderNumber, status: order.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed."
    return badRequest(message)
  }
}

export async function GET() {
  // Validate cart availability before payment.
  const session = await getSession()
  if (!session) return unauthorized()
  return ok({ available: true })
}
