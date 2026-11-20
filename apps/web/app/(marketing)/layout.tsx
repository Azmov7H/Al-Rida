import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { siteConfig } from "@/config/site"
import { getSession } from "@/lib/auth/session"
import { getContent } from "@/services/content.service"

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Premium Door Hardware`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, company] = await Promise.all([getSession(), getContent("company")])
  const brand = (company.name as string) ?? "الرضا"

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
