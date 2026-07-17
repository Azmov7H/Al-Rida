import { productRepository } from "@/repositories/product.repository"
import { requireRole } from "@/lib/auth/guard"
import { ok, badRequest, notFound, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({
  productId: z.string().min(1),
  delta: z.number().int(),
  reason: z.string().optional(),
})

export async function POST(request: Request) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const product = await productRepository.findById(parsed.data.productId)
    if (!product) return notFound("Product not found.")
    const next = Math.max(0, product.stock + parsed.data.delta)
    await productRepository.update(product._id.toString(), { stock: next })
    return ok({ product: product._id, stock: next })
  } catch {
    return serverError()
  }
}
