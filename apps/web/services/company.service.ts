import { companyRepository } from "@/repositories/company.repository"
import { companySaveSchema } from "@/validators/company"
import { connectDB } from "@/lib/db"
import { validationError } from "@/lib/errors"
import type { CompanyData } from "@/types/company"

/**
 * Seed defaults — business data placeholders to be edited by admins
 * (unresolved business questions — see DECISIONS_AND_ASSUMPTIONS.md §B).
 */
export const SEED_DEFAULTS: Partial<CompanyData> = {
  name: "الرضا",
  description:
    "موزع معتمد لأدوات الأبواب (الأوكر، الأقفال، الكوالين) — أصلية من بلدك.",
  websiteUrl: "https://alreda.example",
  googleMapsReviewUrl: "https://www.google.com/maps/place/Al+Rida/reviews",
  instaPayLink: "https://instapay.example/pay/alreda",
  cashWalletNumber: "قناة الحوالة (يجب ملءها بمعلومات الحساب الحقيقية)",
  cashWalletLabel: "محفظة الشركة",
  cashWalletInstructions:
    "للدفع عبر المحفظة النقدية، أرسل المبلغ إلى حسابنا البنكي.",
  logoImageUrl: undefined,
  coverImageUrl: undefined,
  phone: "+20 2 1234 5678",
  whatsappNumber: "+20000000000",
  whatsappPreMessage: "تود التواصل حول Al-Rida، كيف يمكننا مساعدتك؟",
  email: "sales@alreda.example",
  address: {
    street: "تعبئة البيانات بأفراد مشرفين",
    city: "محفظة تعبئة بيانات",
    governorate: "جمهورية مصر العربية",
    postalCode: undefined,
    country: "مصر",
  },
  googleMapsUrl: "https://www.google.com/maps/place/Al+Rida",
  primaryArabicFont: "cairo",
}

export const companyService = {
  /**
   * Get company settings; create from SEED_DEFAULTS if missing.
   * Used by SSR (landing) + public API GET /api/company.
   */
  async getOrCreateDefault(seed?: Partial<CompanyData>): Promise<CompanyData> {
    await connectDB()
    const existing = await companyRepository.getDefault()
    if (existing) return existing
    return companyRepository.createDefault({ ...SEED_DEFAULTS, ...seed })
  },

  /** Same as getOrCreateDefault — SSR helper for landing. */
  async getDefault(): Promise<CompanyData> {
    return companyService.getOrCreateDefault()
  },

  /**
   * Save company settings via dashboard Server Action.
   * Validates full shape (Zod), preserves other fields.
   */
  async updateCompany(input: { [k: string]: unknown }): Promise<CompanyData> {
    const parsed = companySaveSchema.safeParse(input)
    if (!parsed.success) {
      throw validationError(parsed.error.issues.map((i) => ({ path: i.path as string[], message: i.message })))
    }
    const existing = (await companyRepository.getDefault()) ?? SEED_DEFAULTS
    const merged: Partial<CompanyData> = { ...existing, ...parsed.data, address: { ...existing.address, ...parsed.data.address } }
    await companyRepository.upsertDefault(merged)
    return (await companyRepository.getDefault()) ?? (existing as CompanyData)
  },
}
