import { productRepository } from "@/repositories/product.repository"
import type { ProductQueryInput } from "@/validators/product"

export const productService = {
  async getProductPage(query: ProductQueryInput) {
    const filter: Record<string, unknown> = { status: "active" }

    if (query.category) filter.category = query.category
    if (query.brand) filter.brand = query.brand
    if (query.inStock) filter.stock = { $gt: 0 }
    if (query.onSale) filter.salePrice = { $exists: true, $ne: null }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const price: Record<string, number> = {}
      if (query.minPrice !== undefined) price.$gte = query.minPrice
      if (query.maxPrice !== undefined) price.$lte = query.maxPrice
      filter.price = price
    }
    if (query.q) filter.$text = { $search: query.q }

    const sort = resolveSort(query.sort)
    const { items, total, page, limit } = await productRepository.list(
      filter,
      query.page,
      query.limit,
    )
    return { items, total, page, limit, sort }
  },

  async getBySlug(slug: string) {
    return productRepository.findBySlug(slug)
  },
}

function resolveSort(sort?: ProductQueryInput["sort"]): Record<string, 1 | -1> {
  switch (sort) {
    case "price_asc":
      return { price: 1 }
    case "price_desc":
      return { price: -1 }
    case "name":
      return { name: 1 }
    case "newest":
    default:
      return { createdAt: -1 }
  }
}
