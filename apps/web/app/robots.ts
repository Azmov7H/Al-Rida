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
          "/checkout",
          "/cart",
          "/profile",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
