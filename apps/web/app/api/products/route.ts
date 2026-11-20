import { productService } from "@/services/product.service"
import { productQuerySchema } from "@/validators/product"
import { ok, serverError, badRequest } from "@/lib/responses"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = productQuerySchema.safeParse(
      Object.fromEntries(searchParams.entries()),
    )
    if (!parsed.success) {
      return badRequest(parsed.error.flatten())
    }
    const { items, total, page, limit } = await productService.getProductPage(parsed.data)
    return ok(items, "Products fetched.", {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    })
  } catch {
    return serverError()
  }
}
