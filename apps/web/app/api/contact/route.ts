import { z } from "zod"
import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { verifyCsrfForRequest, csrfFailure } from "@/lib/security/csrf"
import { withErrorHandler } from "@/lib/errors"
import { logger } from "@/lib/logger"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
})

async function postHandler(request: Request) {
  if (!(await verifyCsrfForRequest(request))) {
    logger.warn("csrf_failure", { route: "POST /api/contact" })
    return csrfFailure()
  }
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    // TODO: persist message and send notification.
    return ok(null, "Message received.")
  } catch {
    return serverError()
  }
}

export const POST = withErrorHandler(postHandler)

async function getHandler() {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  // TODO: list contact messages.
  return ok([], "Contact messages (pending).")
}

export const GET = withErrorHandler(getHandler)
