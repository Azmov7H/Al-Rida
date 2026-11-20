import { z } from "zod"
import type { CompanyAddress } from "@/types/company"
import { E164, httpsUrl, phoneDisplay } from "@/validators/shared"

export { httpsUrl, E164, phoneDisplay }

export const companyAddressSchema = z.object({
  street: z.string().min(2, "الشارع مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  governorate: z.string().min(2, "المحافظة مطلوبة"),
  country: z.string().min(2, "الدولة مطلوبة"),
  postalCode: z.string().max(16, "رمز البريد غير صالح").optional(),
})
export type CompanyAddressInput = z.infer<typeof companyAddressSchema>

export const companySaveSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(100, "الاسم طويل جداً"),
  description: z.string().min(1, "الوصف مطلوب").max(300, "الوصف طويل جداً"),
  websiteUrl: httpsUrl(256),
  googleMapsReviewUrl: httpsUrl(1024),
  instaPayLink: httpsUrl(1024),
  cashWalletNumber: z.string().min(1, "رقم المحفظة مطلوب").max(64),
  cashWalletLabel: z.string().min(1, "اسم المحفظة مطلوب").max(128),
  cashWalletInstructions: z.string().min(1, "تعليمات المحفظة مطلوبة").max(512),
  phone: phoneDisplay,
  whatsappNumber: z.string().regex(E164, "رقم واتساب غير صالح — ابدأ بـ +20").trim(),
  whatsappPreMessage: z.string().max(120).trim().optional(),
  email: z.string().email("البريد الإلكتروني غير صالح").max(255),
  address: companyAddressSchema,
  googleMapsUrl: httpsUrl(2048),
  primaryArabicFont: z.string().min(1, "اختر الخط").max(32),
})
export type CompanySaveInput = z.infer<typeof companySaveSchema>

export const companyDataShape = companySaveSchema.extend({
  logoImageUrl: z.string().max(2048).optional(),
  coverImageUrl: z.string().max(2048).optional(),
  coordinates: z
    .object({
      lat: z.number().min(-90, "خط العرض غير صالح").max(90),
      lng: z.number().min(-180, "خط الطول غير صالح").max(180),
    })
    .optional(),
})
export type CompanyDataInput = z.infer<typeof companyDataShape>
