import { Hero } from "@/components/landing/hero"
import { Brands } from "@/components/landing/brands"
import { Categories } from "@/components/landing/categories"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { WhyUs } from "@/components/landing/why-us"
import { CompanyNumbers } from "@/components/landing/company-numbers"
import { Projects } from "@/components/landing/projects"
import { Testimonials } from "@/components/landing/testimonials"
import { Cta } from "@/components/landing/cta"
import { productService } from "@/services/product.service"
import { productQuerySchema } from "@/validators/product"

type LandingFeaturedProduct = {
  name: string
  brand: string
  sku: string
  availability: string
  spec: string
  image: string
  salePrice: number | null
}

export const dynamic = "force-dynamic"

export default async function LandingPage() {
  let featuredProducts: LandingFeaturedProduct[] = []

  try {
    const result = await productService.getProductPage(
      productQuerySchema.parse({ page: 1, limit: 4, inStock: true }),
    )

    featuredProducts = result.items.map((product) => {
      const brandName =
        typeof product.brand === "string"
          ? product.brand
          : (product.brand as { name?: string } | null)?.name ?? "الرضا"
      const categoryName =
        typeof product.category === "string"
          ? product.category
          : ((product.category as { name?: string } | null)?.name ?? product.material) ||
            "منتج مميز"

      return {
        name: product.name,
        brand: brandName,
        sku: product.sku,
        availability: product.stock > 0 ? "متوفر" : "غير متوفر",
        spec: categoryName,
        image: product.images?.[0]?.url ?? "",
        salePrice: product.salePrice ?? null,
      }
    })
  } catch {
    featuredProducts = []
  }

  return (
    <main>
      <Hero />
      <Brands />
      <Categories />
      <FeaturedProducts products={featuredProducts} />
      <WhyUs />
      <CompanyNumbers />
      <Projects />
      <Testimonials />
      <Cta />
    </main>
  )
}
