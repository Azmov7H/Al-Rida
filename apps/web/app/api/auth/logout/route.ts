import { destroySession } from "@/lib/auth/session"
import { ok } from "@/lib/responses"

export async function POST() {
  await destroySession()
  return ok(null, "Logged out.")
}
