import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/api",
          "/api/",
          "/login",
          "/register",
          // Legacy e‑commerce routes — removed in P3 (A6)
          "/products",
          "/checkout",
          "/cart",
          "/wishlist",
          "/orders",
          "/search",
          // Authenticated-only (A7 frozen)
          "/profile",
          "/dashboard/profile",
          "/dashboard/orders",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
