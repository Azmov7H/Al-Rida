import { z } from "zod"
import { ok, badRequest } from "@/lib/responses"

const schema = z.object({ token: z.string().min(1) })

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.flatten())
  // TODO: mark email verified.
  return ok(null, "Email verified.")
}
