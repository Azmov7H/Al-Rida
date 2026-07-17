import { ok } from "@/lib/responses"

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}))
  // TODO: verify Paymob HMAC signature and update order payment status.
  void payload
  return ok(null, "Webhook received.")
}
