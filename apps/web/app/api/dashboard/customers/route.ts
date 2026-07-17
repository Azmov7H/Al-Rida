import { requireRole } from "@/lib/auth/guard"
import { ok, serverError } from "@/lib/responses"

export async function GET() {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  try {
    // TODO: customer list.
    return ok({ items: [], total: 0 })
  } catch {
    return serverError()
  }
}
