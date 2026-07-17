import { requireRole } from "@/lib/auth/guard"
import { ok, serverError } from "@/lib/responses"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  await params
  try {
    // TODO: delete asset from Cloudinary.
    return ok(null, "Asset deletion pending Cloudinary integration.")
  } catch {
    return serverError()
  }
}
