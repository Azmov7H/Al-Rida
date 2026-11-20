import { productRepository } from "@/repositories/product.repository"
import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, notFound, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({ stock: z.number().int().min(0) })

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const { id } = await params
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const product = await productRepository.update(id, { stock: parsed.data.stock })
    if (!product) return notFound("Product not found.")
    return ok(product)
  } catch {
    return serverError()
  }
}
