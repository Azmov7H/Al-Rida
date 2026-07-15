import { z } from "zod"

export const productStatusSchema = z.enum([
  "active",
  "draft",
  "out_of_stock",
  "archived",
])

export const productCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().min(2),
  sku: z.string().min(1),
  barcode: z.string().optional(),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  stock: z.number().int().min(0),
  material: z.string().optional(),
  finish: z.string().optional(),
  country: z.string().optional(),
  warranty: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: productStatusSchema.default("draft"),
})

export const productQuerySchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  onSale: z.coerce.boolean().optional(),
  sort: z
    .enum(["price_asc", "price_desc", "newest", "best_selling", "top_rated", "name"])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  q: z.string().optional(),
})

export type ProductCreateInput = z.infer<typeof productCreateSchema>
export type ProductQueryInput = z.infer<typeof productQuerySchema>
