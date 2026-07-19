import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(request: Request) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  try {
    const form = await request.formData().catch(() => null)
    if (!form || !form.get("file")) return badRequest("No file provided.")
    const file = form.get("file") as File
    const folder = (form.get("folder") as string) || "products"
    const { url } = await uploadImage(file, folder)
    return ok({ url }, "Image uploaded.")
  } catch {
    return serverError()
  }
}
