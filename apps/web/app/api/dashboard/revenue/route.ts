import { requireRole } from "@/lib/auth/guard"
import { ok, serverError } from "@/lib/responses"

export async function GET() {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  try {
    // TODO: revenue time series.
    return ok({ series: [] })
  } catch {
    return serverError()
  }
}
