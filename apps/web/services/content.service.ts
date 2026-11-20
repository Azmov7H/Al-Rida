import { connectDB } from "@/lib/db"
import { contentRepository } from "@/repositories/content.repository"
import {
  statistics,
  trustIndicators,
  footerColumns,
  contactInfo,
} from "@/lib/landing-data"

const FALLBACK: Record<string, Record<string, unknown>> = {
  hero: {
    badge: "موزع معتمد للأقفال والأوكر",
    title: "حلول متكاملة للأقفال والأوكر وإكسسوارات الأبواب",
    subtitle:
      "شركة الرضا تقدم منتجات أصلية عالية الجودة من أفضل العلامات التجارية لتلبية احتياجات المنازل، الشركات، المشروعات، والمقاولين.",
    primaryCta: "تصفح المنتجات",
    primaryCtaHref: "/products",
    secondaryCta: "تواصل معنا",
    secondaryCtaHref: "/contact",
  },
  statistics: { items: statistics },
  trust: { items: trustIndicators },
  footer: { columns: footerColumns, contact: contactInfo },
  company: {
    name: "شركة الرضا",
    email: contactInfo.email,
    phone: contactInfo.phone,
    address: contactInfo.address,
  },
}

export async function getContent(
  section: string,
): Promise<Record<string, unknown>> {
  try {
    await connectDB()
    const doc = await contentRepository.getBySection(section)
    if (doc && doc.data && Object.keys(doc.data).length > 0) {
      return doc.data as Record<string, unknown>
    }
  } catch {
    // fall through to defaults
  }
  return FALLBACK[section] ?? {}
}
