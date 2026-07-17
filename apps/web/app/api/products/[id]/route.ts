import { productRepository } from "@/repositories/product.repository"
import { ok, notFound, serverError } from "@/lib/responses"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const product = await productRepository.findById(id)
    if (!product) return notFound("Product not found.")
    return ok(product)
  } catch {
    return serverError()
  }
}
