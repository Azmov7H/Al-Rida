import { addressRepository } from "@/repositories/address.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, badRequest, notFound, serverError } from "@/lib/responses"
import { addressSchema } from "@/validators/address"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const parsed = addressSchema.partial().safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const address = await addressRepository.update(id, guard.session.id, parsed.data)
    if (!address) return notFound("Address not found.")
    return ok(address)
  } catch {
    return serverError()
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const { id } = await params
  try {
    await addressRepository.remove(id, guard.session.id)
    return ok(null, "Address deleted.")
  } catch {
    return serverError()
  }
}
