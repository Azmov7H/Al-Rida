import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, Heart, ShoppingCart } from "lucide-react"
import { productService } from "@/services/product.service"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductCard } from "@/components/products/product-card"
import { formatCurrency } from "@/lib/utils"
import { siteConfig } from "@/config/site"

export async function generateStaticParams() {
  return []
}

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await productService.getBySlug(slug)
  if (!product) return { title: "المنتج غير موجود" }

  const brandName =
    typeof product.brand === "object" && product.brand
      ? String((product.brand as { name?: string }).name ?? "")
      : ""
  const title = product.seo.title || `${product.name} — ${brandName}`
  const description = product.seo.description || `${product.name} من ${brandName}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
    alternates: { canonical: `/products/${product.slug}` },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let product
  try {
    product = await productService.getBySlug(slug)
  } catch {
    product = null
  }
  if (!product) notFound()

  const brandName =
    typeof product.brand === "object" && product.brand
      ? String((product.brand as { name?: string }).name ?? "")
      : String(product.brand ?? "")
  const categoryName =
    typeof product.category === "object" && product.category
      ? String((product.category as { name?: string }).name ?? "")
      : String(product.category ?? "")
  const available = product.stock > 0

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    brand: { "@type": "Brand", name: brandName },
    image: product.images.map((i) => i.url),
    description: product.seo.description || product.name,
    offers: {
      "@type": "Offer",
      price: product.salePrice ?? product.price,
      priceCurrency: "EGP",
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/products/${product.slug}`,
    },
  }

  const related = Array.isArray(product.relatedProducts)
    ? product.relatedProducts
    : []

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex items-center gap-2 text-sm text-[#64748B]">
        <Link href="/" className="hover:text-[#0F3B73]">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#0F3B73]">
          المنتجات
        </Link>
        <span>/</span>
        <span className="text-[#1E293B]">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-5">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#F58220]">
            {brandName}
          </span>
          <h1 className="text-3xl font-bold text-[#1E293B]">{product.name}</h1>
          <p className="text-sm text-[#64748B]">
            SKU: {product.sku} · الفئة: {categoryName}
          </p>

          <span
            className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
              available ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-[#DC2626]/10 text-[#DC2626]"
            }`}
          >
            <Check className="size-4" />
            {available ? `متوفر (${product.stock})` : "غير متوفر"}
          </span>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#1E293B]">
              {formatCurrency(product.salePrice ?? product.price)}
            </span>
            {product.salePrice ? (
              <span className="text-lg text-[#64748B] line-through">
                {formatCurrency(product.price)}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              disabled={!available}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0F3B73] text-base font-semibold text-white transition-colors hover:bg-[#0C2F5C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="size-5" />
              أضف إلى السلة
            </button>
            <button
              aria-label="أضف إلى المفضلة"
              className="inline-flex size-12 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#1E293B] transition-colors hover:border-[#F58220]"
            >
              <Heart className="size-5" />
            </button>
          </div>

          {product.specifications.length > 0 ? (
            <div className="mt-2 overflow-hidden rounded-2xl border border-[#E2E8F0]">
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} className={i % 2 ? "bg-[#F8FAFC]" : "bg-white"}>
                      <th className="w-1/3 px-4 py-3 text-start font-medium text-[#64748B]">
                        {spec.key}
                      </th>
                      <td className="px-4 py-3 text-[#1E293B]">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {product.warranty ? (
            <p className="text-sm text-[#64748B]">الضمان: {product.warranty}</p>
          ) : null}
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-[#1E293B]">منتجات ذات صلة</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => {
              const rel = r as unknown as {
                slug: string
                name: string
                brand: string | { name: string }
                sku: string
                price: number
                salePrice?: number | null
                stock: number
                images: { url: string; alt: string }[]
              }
              return (
                <ProductCard
                  key={rel.slug}
                  product={{
                    slug: rel.slug,
                    name: rel.name,
                    brand: rel.brand,
                    sku: rel.sku,
                    price: rel.price,
                    salePrice: rel.salePrice ?? null,
                    stock: rel.stock,
                    image: rel.images[0]?.url ?? "",
                  }}
                />
              )
            })}
          </div>
        </section>
      ) : null}
    </div>
  )
}
