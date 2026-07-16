import type { Metadata } from "next"
import { Search } from "lucide-react"
import { productService } from "@/services/product.service"
import { productQuerySchema } from "@/validators/product"
import type { IProduct } from "@/models/product"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/filters"
import { SortSelect } from "@/components/products/sort-select"

export const metadata: Metadata = {
  title: "المنتجات",
  description:
    "تصفح أدوات الأبواب والآقفال الأصلية من أفضل العلامات التجارية — كوالين، أوكر، مفصلات، اسطوانات، أقفال ذكية.",
}

export const dynamic = "force-dynamic"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const parsed = productQuerySchema.safeParse(
    Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
    ),
  )
  const query = parsed.success ? parsed.data : productQuerySchema.parse({})

  let items: IProduct[] = []
  let total = 0
  try {
    const result = await productService.getProductPage(query)
    items = result.items
    total = result.total
  } catch {
    // Database unavailable — render empty state instead of crashing.
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">المنتجات</h1>
        <p className="mt-2 text-[#64748B]">
          {total} منتج أصلي من أفضل العلامات التجارية.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProductFilters query={query} />
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form method="get" action="/products" className="relative w-full sm:max-w-sm">
              <input
                type="search"
                name="q"
                defaultValue={query.q ?? ""}
                placeholder="ابحث عن منتج..."
                className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-4 pe-11 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
              />
              <button
                type="submit"
                aria-label="بحث"
                className="absolute end-2 top-1/2 -translate-y-1/2 text-[#64748B]"
              >
                <Search className="size-5" />
              </button>
            </form>

            <form method="get" action="/products" className="flex items-center gap-2">
              {Object.entries(raw)
                .filter(([k]) => k !== "sort")
                .map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={Array.isArray(v) ? v[0] : (v ?? "")} />
                ))}
              <label htmlFor="sort" className="text-sm text-[#64748B]">
                ترتيب:
              </label>
              <SortSelect defaultValue={query.sort ?? "newest"} />
            </form>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center text-[#64748B]">
              لا توجد منتجات مطابقة للفلاتر المحددة.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard
                  key={String(p._id)}
                  product={{
                    slug: p.slug,
                    name: p.name,
                    brand: p.brand as unknown as string | { name: string },
                    sku: p.sku,
                    price: p.price,
                    salePrice: p.salePrice ?? null,
                    stock: p.stock,
                    image: p.images[0]?.url ?? "",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
