import { issueCsrfCookie } from "@/lib/security/csrf"
import { ok } from "@/lib/responses"

/**
 * Public endpoint — issues the readable `csrf-token` cookie for the current
 * browser (Set-Cookie, path=/). Clients fetch it once on mount (CsrfToken
 * component) before submitting forms. P5: extend to all CSRF-gated actions.
 */
export async function GET() {
  await issueCsrfCookie()
  return ok(null, "CSRF token issued.")
}
