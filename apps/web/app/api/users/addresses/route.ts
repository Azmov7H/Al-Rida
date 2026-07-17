import { addressRepository } from "@/repositories/address.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, badRequest, serverError } from "@/lib/responses"
import { addressSchema } from "@/validators/address"

export async function GET() {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  try {
    const addresses = await addressRepository.listByUser(guard.session.id)
    return ok(addresses)
  } catch {
    return serverError()
  }
}

export async function POST(request: Request) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const body = await request.json().catch(() => ({}))
  const parsed = addressSchema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const address = await addressRepository.create({
      user: guard.session.id as unknown as import("mongoose").Types.ObjectId,
      ...parsed.data,
    })
    return ok(address, "Address created.")
  } catch {
    return serverError()
  }
}
