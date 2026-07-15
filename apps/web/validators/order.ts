import { z } from "zod"

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
  shippingAddressId: z.string().min(1),
  billingAddressId: z.string().optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["cod", "paymob", "stripe"]),
  notes: z.string().max(500).optional(),
})

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
  "returned",
])

export type CheckoutInput = z.infer<typeof checkoutSchema>
