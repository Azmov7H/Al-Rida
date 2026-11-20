import { z } from "zod"

export const LINK_ICON_KEYS = [
  "googleMapsReviews",
  "instaPay",
  "cashWallet",
  "whatsapp",
  "officialWebsite",
  "mapPin",
  "mail",
  "phone",
  "globe",
  "shieldCheck",
  "custom",
] as const

export const linkItemSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").max(80, "العنوان طويل جداً").trim(),
  description: z.string().max(120, "الوصف طويل جداً").trim().optional(),
  url: z.string().url("رابط غير صالح").max(2048, "الرابط طويل جداً").trim(),
  iconKey: z.enum(LINK_ICON_KEYS),
  section: z.enum(["main_actions", "footer", "navbar"]),
  displayOrder: z.number().int().min(0).optional(),
  enabled: z.boolean().optional(),
  internalHref: z.string().max(512).trim().optional(),
  targetType: z.enum(["external", "internal"]).optional(),
})

export type LinkItemInput = z.infer<typeof linkItemSchema>

export const linkReorderSchema = z.object({
  slug: z.string().min(1),
  displayOrder: z.number().int().min(0),
})
