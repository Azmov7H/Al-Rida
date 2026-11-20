import { requireRole } from "@/lib/auth/guard"
import { ok, serverError } from "@/lib/responses"

export async function GET() {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  try {
    return ok({ lowStock: [] })
  } catch {
    return serverError()
  }
}
