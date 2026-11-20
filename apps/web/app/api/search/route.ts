import { productService } from "@/services/product.service"
import { productQuerySchema } from "@/validators/product"
import { ok, serverError } from "@/lib/responses"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = productQuerySchema.safeParse(
      Object.fromEntries(searchParams.entries()),
    )
    if (!parsed.success) return ok([], "No results.")
    const { items } = await productService.getProductPage({
      ...parsed.data,
      page: 1,
      limit: 20,
    })
    return ok(items)
  } catch {
    return serverError()
  }
}
