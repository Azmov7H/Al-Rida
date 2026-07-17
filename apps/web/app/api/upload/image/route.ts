import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"

export async function POST(request: Request) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  try {
    const form = await request.formData().catch(() => null)
    if (!form || !form.get("file")) return badRequest("No file provided.")
    // TODO: upload to Cloudinary and return secure URL.
    return ok({ url: "" }, "Upload pending Cloudinary integration.")
  } catch {
    return serverError()
  }
}
