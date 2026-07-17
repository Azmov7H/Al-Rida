import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({
  method: z.enum(["cod", "paymob", "stripe"]),
  orderNumber: z.string().min(1),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    // TODO: integrate Paymob/Stripe payment intent.
    return ok({ method: parsed.data.method, redirect: null })
  } catch {
    return serverError()
  }
}
