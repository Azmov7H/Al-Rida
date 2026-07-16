import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export interface ProductCardData {
  slug: string
  name: string
  brand: string | { name: string }
  sku: string
  price: number
  salePrice?: number | null
  stock: number
  image: string
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const available = product.stock > 0
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square border-b border-[#E2E8F0] bg-[#F8FAFC]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-cover"
        />
        {product.salePrice ? (
          <span className="absolute end-3 top-3 rounded-full bg-[#F58220] px-3 py-1 text-xs font-semibold text-white">
            عرض
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#F58220]">
          {typeof product.brand === "string" ? product.brand : product.brand.name}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="font-semibold text-[#1E293B] hover:text-[#0F3B73]"
        >
          {product.name}
        </Link>
        <span className="text-xs text-[#64748B]">SKU: {product.sku}</span>
        <span
          className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            available ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-[#DC2626]/10 text-[#DC2626]"
          }`}
        >
          <Check className="size-3.5" />
          {available ? "متوفر" : "غير متوفر"}
        </span>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="text-lg font-bold text-[#1E293B]">
            {formatCurrency(product.price)}
          </span>
          {product.salePrice ? (
            <span className="text-sm text-[#64748B] line-through">
              {formatCurrency(product.salePrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
