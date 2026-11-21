import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { getSession } from "@/lib/auth/session"
import { companyService } from "@/services/company.service"
import { testimonialRepository } from "@/repositories/testimonial.repository"
import {
  aggregateRatingJsonLd,
  landingJsonLdScripts,
  toJsonLd,
} from "@/lib/seo/structured-data"

export const metadata: Metadata = {
  title: {
    default: "الرضا — منصة أوكر الأبواب والأقفال والكوالين",
    template: "%s · الرضا",
  },
  description:
    "خدمة الأبواب والأقفال والكوالين الأصلية — الرضا: منصة رقمية للأعمال اليدوية المحترفة.",
  openGraph: {
    title: "الرضا — منصة أوكر الأبواب والأقفال والكوالين",
    description:
      "خدمة الأبواب والأقفال والكوالين الأصلية — الرضا: منصة رقمية للأعمال اليدوية المحترفة.",
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "الرضا",
    description: "خدمة الأبواب والأقفال الأصلية — الرضا: منصة رقمية للأعمال اليدوية المحترفة.",
  },
}

function JsonLd({ value }: { value: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(value) }} />
  )
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, company, testimonials] = await Promise.all([
    getSession(),
    companyService.getDefault(),
    testimonialRepository.getPublishedVerified(),
  ])
  const brand = company.name
  const jsonLd = landingJsonLdScripts({ company, testimonials })

  return (
    <>
      <Navbar
        session={session ? { role: session.role, name: session.name } : null}
        brand={brand}
      />
      <JsonLd value={jsonLd.localBusiness} />
      <JsonLd value={jsonLd.organization} />
      <JsonLd value={jsonLd.website} />
      {jsonLd.reviews.map((review, i) => (
        <JsonLd key={i} value={review} />
      ))}
      {jsonLd.aggregates ? (
        <JsonLd value={aggregateRatingJsonLd(jsonLd.aggregates)} />
      ) : null}
      {children}
      <Footer />
    </>
  )
}
