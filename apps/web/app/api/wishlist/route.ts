import { wishlistRepository } from "@/repositories/wishlist.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

export async function GET() {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  try {
    return ok(await wishlistRepository.getByUser(guard.session.id))
  } catch {
    return serverError()
  }
}

const schema = z.object({ product: z.string().min(1) })

export async function POST(request: Request) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    return ok(await wishlistRepository.toggle(guard.session.id, parsed.data.product))
  } catch {
    return serverError()
  }
}
