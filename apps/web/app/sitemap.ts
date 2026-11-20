import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"
import { connectDB } from "@/lib/db"
import { productRepository } from "@/repositories/product.repository"
import { categoryRepository } from "@/repositories/category.repository"
import { brandRepository } from "@/repositories/brand.repository"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url
  const staticPages = ["", "/products", "/brands", "/categories", "/about", "/contact", "/projects", "/offers"]
    .map((p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    }))

  let dynamicPages: MetadataRoute.Sitemap = []
  try {
    await connectDB()
    const [products, categories, brands] = await Promise.all([
      productRepository.list({}, 1, 1000),
      categoryRepository.list(),
      brandRepository.list(),
    ])
    dynamicPages = [
      ...(products.items as { slug: string }[]).map((p) => ({
        url: `${base}/products/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...(categories as { slug: string }[]).map((c) => ({
        url: `${base}/categories/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...(brands as { slug: string }[]).map((b) => ({
        url: `${base}/brands/${b.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ]
  } catch {
    // Database unavailable — include static pages only.
  }

  return [...staticPages, ...dynamicPages]
}
