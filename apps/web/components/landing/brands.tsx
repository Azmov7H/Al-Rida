import { Section, SectionTitle } from "./section"
import { brands } from "@/lib/landing-data"

export function Brands() {
  return (
    <Section className="bg-white">
      <SectionTitle
        eyebrow="العلامات التجارية"
        title="العلامات التجارية"
        description="نفخر بتوفير منتجات من أفضل الشركات المحلية والعالمية."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {brands.map((brand) => (
          <div
            key={brand}
            className="flex h-20 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-center text-sm font-semibold text-[#1E293B]"
          >
            {brand}
          </div>
        ))}
      </div>
    </Section>
  )
}
