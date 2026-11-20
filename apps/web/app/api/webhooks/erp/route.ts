import { ok } from "@/lib/responses"

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}))
  // TODO: handle ERP sync events.
  void payload
  return ok(null, "Webhook received.")
}
