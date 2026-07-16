import Image from "next/image"
import { Check } from "lucide-react"
import { Section, SectionTitle } from "./section"
import { featuredProducts } from "@/lib/landing-data"
import { productImage } from "@/lib/images"

export function FeaturedProducts() {
  return (
    <Section className="bg-white">
      <SectionTitle
        eyebrow="مختارة بعناية"
        title="منتجات مميزة"
        description="منتجات أصلية بمواصفات فنية وضمان جودة."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product, i) => (
          <article
            key={product.sku}
            className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-square border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <Image
                src={productImage(i)}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#F58220]">
                {product.brand}
              </span>
              <h3 className="font-semibold text-[#1E293B]">{product.name}</h3>
              <span className="text-xs text-[#64748B]">SKU: {product.sku}</span>
              <p className="text-xs text-[#64748B]">{product.spec}</p>
              <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-[#16A34A]/10 px-2.5 py-1 text-xs font-medium text-[#16A34A]">
                <Check className="size-3.5" />
                {product.availability}
              </span>
              <button className="mt-auto inline-flex h-11 items-center justify-center rounded-lg bg-[#0F3B73] text-sm font-semibold text-white transition-colors hover:bg-[#0C2F5C]">
                عرض التفاصيل
              </button>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
