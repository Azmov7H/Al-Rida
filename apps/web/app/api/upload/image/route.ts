import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { uploadImage } from "@/lib/cloudinary"
import { rateLimit, clientKey } from "@/lib/security/rate-limit"
import { withErrorHandler } from "@/lib/errors"
import { logger } from "@/lib/logger"

async function handler(request: Request) {
  const rl = rateLimit(clientKey("api-upload", request), 30, 60_000)
  if (!rl.success) {
    return badRequest("Too many uploads.")
  }
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  try {
    const form = await request.formData().catch(() => null)
    if (!form || !form.get("file")) return badRequest("No file provided.")
    const file = form.get("file") as File
    const folder = (form.get("folder") as string) || "products"
    const { url } = await uploadImage(file, folder)
    return ok({ url }, "Image uploaded.")
  } catch (err) {
    logger.error("upload_failed", err)
    return serverError()
  }
}

export const POST = withErrorHandler(handler)
