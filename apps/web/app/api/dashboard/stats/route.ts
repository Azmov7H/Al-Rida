import { requireRole } from "@/lib/auth/guard"
import { ok, serverError } from "@/lib/responses"

export async function GET() {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  try {
    // TODO: aggregate real metrics.
    return ok({
      revenue: 0,
      orders: 0,
      customers: 0,
      products: 0,
      pendingOrders: 0,
    })
  } catch {
    return serverError()
  }
}
