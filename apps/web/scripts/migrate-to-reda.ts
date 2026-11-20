/**
 * Al-Reda Migration Script — seeds the new business-data collections.
 *
 * Usage: pnpm db:migrate-reda (or: npx tsx scripts/migrate-to-reda.ts)
 *   --dry-run   — verify, don't write.
 *   --yes       — skip confirmation prompt.
 *
 * Idempotent: safe to re-run (upserts on slug/key).
 */
import { readFileSync } from "node:fs"
import { connectDB } from "@/lib/db"
import { Company } from "@/models/company"
import { LinkItem } from "@/models/link-item"
import { Testimonial } from "@/models/testimonial"
import { BrandSettings } from "@/models/brand-settings"
import { companyService, SEED_DEFAULTS } from "@/services/company.service"
import { linkRepository } from "@/repositories/link.repository"
import { testimonialRepository } from "@/repositories/testimonial.repository"
import { brandSettingsRepository } from "@/repositories/brand-settings.repository"
import { contentRepository } from "@/repositories/content.repository"
import { slugify } from "@/lib/slugify"
import type { CompanyAddress, CompanyData } from "@/types/company"
import type { LinkItemCreate } from "@/types/link"
import type { ITestimonial } from "@/models/testimonial"

// Load .env.local (scripts run via tsx; env loaded by Next at runtime otherwise).
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const i = line.indexOf("=")
  if (i > 0 && !line.startsWith("#")) {
    const key = line.slice(0, i).trim()
    const val = line.slice(i + 1).trim().replace(/^"|"$/g, "")
    if (!(key in process.env)) process.env[key] = val
  }
}

const APPLY = !process.argv.includes("--dry-run")

/** Old hardcoded testimonials (from services/content.service.ts FALLBACK + lib/landing-data.ts). */
const LEGACY_TESTIMONIALS = [
  {
    name: "مهندس عمر حسن",
    role: "مقاول إنشاءات",
    rating: 5,
    comment: "مورد موثوق لأدوات الأبواب في مشاريعنا، جودة والتزام بالمواعيد.",
  },
  {
    name: "م. ليلى عادل",
    role: "مصممة داخلية",
    rating: 5,
    comment: "الأقفال الذكية واللمسات الاحترافية رفعت جودة مشاريع عملائنا.",
  },
  {
    name: "أ. كريم صالح",
    role: "مدير منشأة",
    rating: 4,
    comment: "توريد سريع ودعم فني ممتاز لفنادقنا ومشاريعنا التجارية.",
  },
]

/** Footer links from old FALLBACK.footer.columns (compiled: title, links). */
const LEGACY_FOOTER_LINKS: Record<string, string> = {
  من_نحن: "/about",
  المشاريع: "/projects",
  العروض: "/offers",
  اتصل_بنا: "/contact",
  الأقفال: "/products",
  الأوكر: "/products",
  المفصلات: "/products",
  الأقفال_الذكية: "/products",
  Al_Ahram: "/brands",
  Yale: "/brands",
  Kale: "/brands",
  ASSA_Abloy: "/brands",
  الشحن: "/contact",
  الإرجاع: "/contact",
  الضمان: "/contact",
  الأسئلة_الشائعة: "/contact",
}

/**
 * The 5 main actions — plan §2.3.
 * URLs are placeholder values (admin should verify/edit in dashboard — B3–B5).
 */
const MAIN_ACTION_LINKS: Array<LinkItemCreate> = [
  { title: "آراء الزبائر على خرائط جوجل", description: "شارك تجربتك مع عملاء المنطقة.", url: "https://alreda.example/reviews", iconKey: "googleMapsReviews", section: "main_actions" },
  { title: "InstaPay", description: "ادفع بطريقة آمنة.", url: "https://alreda.example/pay/instapay", iconKey: "instaPay", section: "main_actions" },
  { title: "محفظة الشركة", description: "طريقة مباشرة للدفع عبر المحفظة النقدية.", url: "https://alreda.example/pay/wallet", iconKey: "cashWallet", section: "main_actions" },
  { title: "رسالة واتساب", description: "تواصل معنا على واتساب.", url: "https://wa.me/20000000000", iconKey: "whatsapp", section: "main_actions" },
  { title: "الموقع الرسمي", description: "استكشف المنتجات والخدمات على موقعنا.", url: "https://alreda.example", iconKey: "officialWebsite", section: "main_actions" },
]

async function main() {
  await connectDB()

  // --- 1) Company singleton — legacy data wins over SEED_DEFAULTS ---
  const legacy = await contentRepository.getBySection("company")
  const legacyAddress = (legacy?.data as { address?: string } | null)?.address
  const seed = {
    address: {
      ...SEED_DEFAULTS.address,
      governorate: legacyAddress ?? SEED_DEFAULTS.address?.governorate ?? "القاهرة، جمهورية مصر العربية",
    } as CompanyAddress,
  }
  let company: CompanyData | null = null
  if (APPLY) {
    company = await companyService.getOrCreateDefault(seed)
  }

  // --- 2) BrandSettings singleton (defaults) ---
  if (APPLY) await brandSettingsRepository.getOrCreateDefault()

  // --- 3) Testimonials (legacy hardcoded → published + verified) ---
  let count = 0
  for (const t of LEGACY_TESTIMONIALS) {
    if (APPLY) {
      await testimonialRepository.upsert({
        ...t,
        isPublished: true,
        isVerified: true,
      } as Partial<ITestimonial>)
    }
    count += 1
  }

  // --- 4) LinkItems — footer + main_actions (main enabled) ---
  let linkCount = 0
  for (const [i, [title, href]] of Object.entries(LEGACY_FOOTER_LINKS).entries()) {
    const slug = slugify(title)
    if (!(await linkRepository.findBySlug(slug))) {
      linkCount += 1
      if (APPLY) {
        await linkRepository.create({
          title,
          url: href,
          iconKey: "mapPin",
          section: "footer",
          displayOrder: i,
          enabled: true,
        })
      }
    }
  }
  for (const [i, doc] of MAIN_ACTION_LINKS.entries()) {
    const slug = slugify(doc.title)
    if (!(await linkRepository.findBySlug(slug))) {
      linkCount += 1
      if (APPLY) {
        await linkRepository.create({ ...doc, displayOrder: i })
      }
    }
  }

  // --- 5) Indexes (idempotent) ---
  if (APPLY) {
    await Promise.all([
      Company.ensureIndexes(),
      LinkItem.ensureIndexes(),
      Testimonial.ensureIndexes(),
      BrandSettings.ensureIndexes(),
    ])
  }

  // --- 6) Verify + summary ---
  const companyCount = await Company.countDocuments()
  const linkTotal = await LinkItem.countDocuments()
  const testimonialTotal = await Testimonial.countDocuments()

  console.log("[migrate-to-reda] (dry-run: %s)", !APPLY)
  if (APPLY) {
    console.log("  Company:          name=%s, phone=%s", company?.name, company?.phone)
    console.log("  LinkItems seeded: %d (footer + main_actions)", linkCount)
    console.log("  Testimonials:     %d (published+verified)", count)
  }
  console.log("  Totals: Company=%d LinkItem=%d Testimonial=%d BrandSettings", companyCount, linkTotal, testimonialTotal)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[migrate-to-reda] FAILED:", err)
    process.exit(1)
  })
