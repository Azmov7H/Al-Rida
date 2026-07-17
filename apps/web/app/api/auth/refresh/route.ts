import { getSession, createSession } from "@/lib/auth/session"
import { ok, unauthorized } from "@/lib/responses"

export async function POST() {
  const session = await getSession()
  if (!session) return unauthorized()
  await createSession(session)
  return ok(session)
}
