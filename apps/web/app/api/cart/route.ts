import { cartRepository } from "@/repositories/cart.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

export async function GET() {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  try {
    return ok(await cartRepository.getByUser(guard.session.id))
  } catch {
    return serverError()
  }
}

const itemSchema = z.object({ product: z.string().min(1), quantity: z.number().int().min(1) })

export async function POST(request: Request) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const parsed = itemSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    return ok(await cartRepository.addItem(guard.session.id, parsed.data.product, parsed.data.quantity))
  } catch {
    return serverError()
  }
}
