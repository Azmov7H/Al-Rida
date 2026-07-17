import { getSession } from "@/lib/auth/session"
import { ok, unauthorized } from "@/lib/responses"

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  return ok(session)
}
