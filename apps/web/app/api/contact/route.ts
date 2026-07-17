import { z } from "zod"
import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    // TODO: persist message and send notification.
    return ok(null, "Message received.")
  } catch {
    return serverError()
  }
}

export async function GET() {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  // TODO: list contact messages.
  return ok([], "Contact messages (pending).")
}
