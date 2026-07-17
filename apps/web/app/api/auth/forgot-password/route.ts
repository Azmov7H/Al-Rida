import { z } from "zod"
import { ok, badRequest } from "@/lib/responses"

const schema = z.object({ email: z.string().email() })

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.flatten())
  // TODO: generate reset token + send email.
  return ok(null, "If the email exists, a reset link has been sent.")
}
