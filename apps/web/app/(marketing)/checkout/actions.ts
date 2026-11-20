"use server"

import { redirect } from "next/navigation"
import { orderService } from "@/services/order.service"
import { addressSchema } from "@/validators/address"
import { z } from "zod"
import { rateLimit, rateLimitKey } from "@/lib/security/rate-limit"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"
import { headers } from "next/headers"

export type CheckoutState = { error?: string }

const itemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
})

const placeOrderSchema = z.object({
  items: z.array(itemSchema).min(1),
  address: addressSchema,
  paymentMethod: z.enum(["cod", "paymob", "stripe"]),
  shippingFee: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
})

async function clientIp(): Promise<string> {
  const h = await headers()
  const fwd = h.get("x-forwarded-for")
  return fwd?.split(",")[0]?.trim() ?? "unknown"
}

export async function placeOrderAction(_state: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const rl = rateLimit(rateLimitKey("checkout", await clientIp()), 10, 60_000)
  if (!rl.success) {
    return { error: "طلبات كثيرة، حاول لاحقاً." }
  }

  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "placeOrderAction" })
    return { error: "طلب غير صالح." }
  }

  const raw = {
    items: JSON.parse((formData.get("items") as string) || "[]"),
    address: {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      governorate: formData.get("governorate"),
      city: formData.get("city"),
      street: formData.get("street"),
      postalCode: formData.get("postalCode") || undefined,
      email: formData.get("email"),
    },
    paymentMethod: formData.get("paymentMethod"),
    shippingFee: formData.get("shippingFee")
      ? Number(formData.get("shippingFee"))
      : undefined,
    notes: formData.get("notes") || undefined,
  }

  const parsed = placeOrderSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: "يرجى التحقق من البيانات المدخلة." }
  }

  let orderNumber: string | null = null
  try {
    const order = await orderService.placeGuestOrder(parsed.data)
    orderNumber = order.orderNumber
  } catch (err) {
    const message = err instanceof Error ? err.message : "تعذر إتمام الطلب."
    return { error: message }
  }

  await audit({
    actorRole: "guest",
    action: "order.placed",
    target: "order",
    metadata: { orderNumber, ip: await clientIp() },
  })
  redirect(`/checkout/confirmation?order=${orderNumber}`)
}

