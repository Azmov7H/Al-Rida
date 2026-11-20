import { ok, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"
import { productRepository } from "@/repositories/product.repository"

const schema = z.object({
  items: z
    .array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1) }))
    .min(1),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const issues: string[] = []
    let subtotal = 0
    for (const line of parsed.data.items) {
      const product = await productRepository.findById(line.productId)
      if (!product) {
        issues.push(`Product not found: ${line.productId}`)
        continue
      }
      if (product.stock < line.quantity) {
        issues.push(`Insufficient stock: ${product.name}`)
      }
      subtotal += (product.salePrice ?? product.price) * line.quantity
    }
    return ok({ subtotal, valid: issues.length === 0, issues })
  } catch {
    return serverError()
  }
}
