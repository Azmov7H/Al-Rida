import { z } from "zod"
import { httpsUrl } from "@/validators/shared"

export const testimonialPublicSchema = z.object({
  name: z.string().min(1, "اسم العميل مطلوب").max(100, "اسم العميل طويل جداً").trim(),
  role: z.string().max(64, "الصف/الشركة مطلوبة").trim().optional(),
  rating: z
    .number()
    .int()
    .min(1, "التقييم يجب أن يكون بين 1 و 5")
    .max(5, "التقييم يجب أن يكون بين 1 و 5"),
  comment: z.string().min(1, "محتوى التقييم مطلوب").max(500, "محتوى التقييم طويل جداً").trim(),
  avatarUrl: httpsUrl(2048).optional(),
})

export const testimonialAdminSchema = testimonialPublicSchema.extend({
  id: z.string().min(1).optional(),
  isPublished: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
})
