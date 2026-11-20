/**
 * Structured Data builders (JSON-LD) — plan §3.
 *
 * Emitted as invisible `<script type="application/ld+json">` tags.
 *  - LocalBusiness / Organization — company.schema — trust/search.
 *  - WebSite — sitemap + sitelinks.
 *  - Review — per published+verified Testimonial (public projection).
 *  - AggregateRating — average over published+verified.
 */
import type { CompanyData } from "@/types/company"
import type { PublicTestimonial } from "@/repositories/testimonial.repository"

interface LocalBusiness extends Record<string, unknown> {
  "@type": "LocalBusiness"
  "@id": string
  name: string
  description: string
  url: string
  telephone: string
  email: string
  address: {
    "@type": "PostalAddress"
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode?: string
    addressCountry?: string
  }
  geo: {
    "@type": "GeoCoordinates"
    latitude: number
    longitude: number
  }
  aggregateRating?: {
    "@type": "AggregateRating"
    ratingValue: number
    ratingCount: number
    bestRating: 5
    worstRating: 1
  }
}

interface Organization extends Record<string, unknown> {
  "@type": "Organization"
  name: string
  url: string
  logo: { url: string; width: number; height: number }
  email: string
  description: string
}

interface Website extends Record<string, unknown> {
  "@type": "WebSite"
  url: string
  name: string
  publisher: Organization
  potentialAction?: {
    "@type": "SearchAction"
    target: string
    queryInput: string
  }
}

interface Review extends Record<string, unknown> {
  "@type": "Review"
  reviewerName: string
  reviewBody: string
  reviewRating: {
    "@type": "Rating"
    bestRating: 5
    worstRating: 1
    ratingValue: number
  }
  datePublished?: string
}

export function localBusinessJsonLd(
  company: CompanyData,
  aggregates?: { ratingValue: number; ratingCount: number },
): LocalBusiness {
  const obj: LocalBusiness = {
    "@type": "LocalBusiness",
    "@id": `${company.websiteUrl}/#localbusiness`,
    name: company.name,
    description: company.description,
    url: company.websiteUrl,
    telephone: company.phone,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.governorate,
      postalCode: company.address.postalCode,
      addressCountry: company.address.country,
    },
    geo: company.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: company.coordinates.lat,
          longitude: company.coordinates.lng,
        }
      : {
          "@type": "GeoCoordinates",
          latitude: 30.0444, // Cairo (plan default)
          longitude: 31.2357,
        },
  }
  if (aggregates && aggregates.ratingCount > 0) {
    obj.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregates.ratingValue,
      ratingCount: aggregates.ratingCount,
      bestRating: 5,
      worstRating: 1,
    }
  }
  return obj
}

export function organizationJsonLd(company: CompanyData): Organization {
  return {
    "@type": "Organization",
    name: company.name,
    url: company.websiteUrl,
    logo: {
      url: `${company.websiteUrl.replace(/\/$/, "")}/favicon.ico`,
      width: 512,
      height: 512,
    },
    email: company.email,
    description: company.description,
  }
}

export function websiteJsonLd(company: CompanyData): Website {
  return {
    "@type": "WebSite",
    url: company.websiteUrl,
    name: company.name,
    publisher: organizationJsonLd(company),
  }
}

export function reviewJsonLd(testimonial: PublicTestimonial): Review {
  return {
    "@type": "Review",
    reviewerName: testimonial.name,
    reviewBody: testimonial.comment,
    reviewRating: {
      "@type": "Rating",
      bestRating: 5,
      worstRating: 1,
      ratingValue: testimonial.rating,
    },
    datePublished: testimonial.createdAt?.toISOString?.() ?? undefined,
  }
}

export function aggregateRatingJsonLd(stats: {
  ratingValue: number
  ratingCount: number
}): {
  "@type": "AggregateRating"
  ratingValue: number
  ratingCount: number
  bestRating: 5
  worstRating: 1
} {
  return {
    "@type": "AggregateRating",
    ratingValue: stats.ratingValue,
    ratingCount: stats.ratingCount,
    bestRating: 5,
    worstRating: 1,
  }
}
