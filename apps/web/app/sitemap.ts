import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"
import { connectDB } from "@/lib/db"
import { brandRepository } from "@/repositories/brand.repository"

export const dynamic = "force-dynamic"

/** Sitemap — new public pages (A6: products/checkout/cart/wishlist/orders removed). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url
  const staticPages = ["", "/about", "/contact", "/projects", "/offers", "/brands"]
    .map((p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    }))

  let dynamicPages: MetadataRoute.Sitemap = []
  try {
    await connectDB()
    const brands = await brandRepository.list()
    dynamicPages = (brands as { slug: string }[]).map((b) => ({
      url: `${base}/brands/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch {
    // Database unavailable — static pages only.
  }

  return [...staticPages, ...dynamicPages]
}
