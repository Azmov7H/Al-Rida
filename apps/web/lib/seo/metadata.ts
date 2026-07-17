import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

const SITE_NAME = siteConfig.name

/**
 * Build a page title following the Seo.md formula:
 *   Product Name | Brand | Al Reda
 * Falls back to "Page | Al Reda" when no brand is provided.
 */
export function buildTitle(page: string, brand?: string): string {
  if (brand) return `${page} | ${brand} | ${SITE_NAME}`
  return `${page} | ${SITE_NAME}`
}

export function buildDescription(description: string): string {
  const clean = description.trim()
  if (clean.length <= 160) return clean
  return `${clean.slice(0, 157).trimEnd()}...`
}

interface OgInput {
  title: string
  description: string
  url: string
  image?: string
  locale?: string
}

export function buildOpenGraph({
  title,
  description,
  url,
  image,
  locale = "ar-EG",
}: OgInput) {
  return {
    type: "website" as const,
    locale,
    url,
    siteName: SITE_NAME,
    title,
    description,
    images: image ? [{ url: image }] : undefined,
  }
}

export function buildTwitter({
  title,
  description,
  image,
}: {
  title: string
  description: string
  image?: string
}) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: image ? [image] : undefined,
  }
}

export function buildMetadata(input: {
  title: string
  description: string
  path: string
  brand?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const title = buildTitle(input.title, input.brand)
  const description = buildDescription(input.description)
  const url = `${siteConfig.url}${input.path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: buildOpenGraph({ title, description, url, image: input.image }),
    twitter: buildTwitter({ title, description, image: input.image }),
  }
}
