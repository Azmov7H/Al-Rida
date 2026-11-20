import { readFileSync } from "node:fs"
import { connectDB } from "@/lib/db"
import { contentRepository } from "@/repositories/content.repository"
import { statistics, trustIndicators, footerColumns, contactInfo } from "@/lib/landing-data"

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const i = line.indexOf("=")
  if (i > 0 && !line.startsWith("#")) {
    const key = line.slice(0, i).trim()
    const val = line.slice(i + 1).trim().replace(/^"|"$/g, "")
    if (!(key in process.env)) process.env[key] = val
  }
}

async function main() {
  await connectDB()

  await contentRepository.upsert(
    "hero",
    {
      badge: "موزع معتمد للأقفال والأوكر",
      title: "حلول متكاملة للأقفال والأوكر وإكسسوارات الأبواب",
      subtitle:
        "شركة الرضا تقدم منتجات أصلية عالية الجودة من أفضل العلامات التجارية لتلبية احتياجات المنازل، الشركات، المشروعات، والمقاولين.",
      primaryCta: "تصفح المنتجات",
      primaryCtaHref: "/products",
      secondaryCta: "تواصل معنا",
      secondaryCtaHref: "/contact",
    },
    "الصفحة الرئيسية (Hero)",
  )

  await contentRepository.upsert(
    "statistics",
    { items: statistics },
    "الأرقام والإحصائيات",
  )

  await contentRepository.upsert(
    "trust",
    { items: trustIndicators },
    "مؤشرات الثقة",
  )

  await contentRepository.upsert(
    "footer",
    { columns: footerColumns, contact: contactInfo },
    "الفوتر",
  )

  await contentRepository.upsert(
    "company",
    {
      name: "شركة الرضا",
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address,
    },
    "معلومات الشركة",
  )

  console.log("Content seeded successfully.")
  process.exit(0)
}

void main()
