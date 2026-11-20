import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({
  siteName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  currency: z.string().optional(),
})

export async function GET() {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  try {
    // TODO: read from Settings collection.
    return ok({ siteName: "Al Reda", contactEmail: "", currency: "EGP" })
  } catch {
    return serverError()
  }
}

export async function PATCH(request: Request) {
  const guard = await requireRole("admin")
  if ("response" in guard) return guard.response
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    // TODO: persist settings.
    return ok(parsed.data)
  } catch {
    return serverError()
  }
}
