import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({ status: z.enum(["new", "read", "replied", "archived"]) })

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const { id } = await params
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    // TODO: update message status.
    return ok({ id, status: parsed.data.status })
  } catch {
    return serverError()
  }
}
