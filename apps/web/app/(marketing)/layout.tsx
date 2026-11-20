import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { getSession } from "@/lib/auth/session"
import { companyService } from "@/services/company.service"

export const metadata: Metadata = {
  title: {
    default: "الرضا — منصة أوكر الأبواب والأقفال والكوالين",
    template: "%s · الرضا",
  },
  description:
    "خدمة الأبواب والأقفال والكوالين الأصلية — الرضا: منصة رقمية للأعمال اليدوية المحترفة.",
  openGraph: {
    title: "الرضا — منصة أوكر الأبواب والأقفال والكوالين",
    description: "خدمة الأبواب والأقفال والكوالين الأصلية — الرضا: منصة رقمية للأعمال اليدوية المحترفة.",
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "الرضا",
    description: "خدمة الأبواب والأقفال الأصلية — الرضا: منصة رقمية للأعمال اليدوية المحترفة.",
  },
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, company] = await Promise.all([getSession(), companyService.getDefault()])
  const brand = company.name

  return (
    <>
      <Navbar
        session={session ? { role: session.role, name: session.name } : null}
        brand={brand}
      />
      {children}
      <Footer />
    </>
  )
}
