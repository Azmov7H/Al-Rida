import { orderService } from "@/services/order.service"
import { ok, badRequest, unauthorized } from "@/lib/responses"
import { getSession } from "@/lib/auth/session"
import { z } from "zod"
import { rateLimit, clientKey } from "@/lib/security/rate-limit"
import { verifyCsrfForRequest, csrfFailure } from "@/lib/security/csrf"
import { withErrorHandler } from "@/lib/errors"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"

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

async function handler(request: Request) {
  const rl = rateLimit(clientKey("api-checkout", request), 10, 60_000)
  if (!rl.success) {
    return badRequest("Too many requests.")
  }
  if (!(await verifyCsrfForRequest(request))) {
    logger.warn("csrf_failure", { route: "POST /api/checkout" })
    return csrfFailure()
  }
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const order = await orderService.placeGuestOrder(parsed.data)
    await audit({
      actorRole: "guest",
      action: "order.placed",
      target: "order",
      targetId: order.orderNumber,
    })
    return ok({ orderNumber: order.orderNumber, status: order.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed."
    return badRequest(message)
  }
}

export const POST = withErrorHandler(handler)

async function getHandler() {
  const session = await getSession()
  if (!session) return unauthorized()
  return ok({ available: true })
}

export const GET = withErrorHandler(getHandler)
