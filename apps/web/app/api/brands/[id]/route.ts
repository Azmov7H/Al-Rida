import { brandRepository } from "@/repositories/brand.repository"
import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, notFound, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  logo: z.string().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const { id } = await params
  const parsed = schema.partial().safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const brand = await brandRepository.update(id, parsed.data)
    if (!brand) return notFound("Brand not found.")
    return ok(brand)
  } catch {
    return serverError()
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const { id } = await params
  try {
    await brandRepository.remove(id)
    return ok(null, "Brand deleted.")
  } catch {
    return serverError()
  }
}
