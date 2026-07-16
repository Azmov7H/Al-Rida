import type { ProductQueryInput } from "@/validators/product"

const CATEGORIES = [
  "كوالين",
  "أوكر",
  "مفصلات",
  "اسطوانات",
  "أقفال ذكية",
  "إكسسوارات الأبواب",
]

const BRANDS = ["Mul-T-Lock", "Yale", "Hafele", "ASSA Abloy", "Al Ahram", "Kale"]

export function ProductFilters({ query }: { query: ProductQueryInput }) {
  const params = new URLSearchParams()
  if (query.q) params.set("q", query.q)
  if (query.sort) params.set("sort", query.sort)

  return (
    <form
      method="get"
      action={`/products?${params.toString()}`}
      className="flex flex-col gap-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
    >
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-[#1E293B]">الفئات</legend>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-[#64748B]">
              <input
                type="checkbox"
                name="category"
                value={c}
                defaultChecked={query.category === c}
                className="size-4 rounded border-[#E2E8F0] text-[#0F3B73] focus:ring-[#0F3B73]"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-[#1E293B]">العلامات التجارية</legend>
        <div className="flex flex-col gap-2">
          {BRANDS.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm text-[#64748B]">
              <input
                type="checkbox"
                name="brand"
                value={b}
                defaultChecked={query.brand === b}
                className="size-4 rounded border-[#E2E8F0] text-[#0F3B73] focus:ring-[#0F3B73]"
              />
              {b}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-[#1E293B]">السعر (ج.م)</legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="من"
            defaultValue={query.minPrice}
            className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="إلى"
            defaultValue={query.maxPrice}
            className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-[#64748B]">
          <input
            type="checkbox"
            name="inStock"
            value="true"
            defaultChecked={query.inStock === true}
            className="size-4 rounded border-[#E2E8F0] text-[#0F3B73] focus:ring-[#0F3B73]"
          />
          متوفر فقط
        </label>
        <label className="flex items-center gap-2 text-sm text-[#64748B]">
          <input
            type="checkbox"
            name="onSale"
            value="true"
            defaultChecked={query.onSale === true}
            className="size-4 rounded border-[#E2E8F0] text-[#0F3B73] focus:ring-[#0F3B73]"
          />
          عروض فقط
        </label>
      </fieldset>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#0F3B73] text-sm font-semibold text-white transition-colors hover:bg-[#0C2F5C]"
      >
        تطبيق الفلاتر
      </button>
    </form>
  )
}
