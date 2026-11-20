import { z } from "zod"

export const addressSchema = z.object({
  fullName: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(8, "رقم الهاتف غير صالح"),
  governorate: z.string().min(2, "المحافظة مطلوبة"),
  city: z.string().min(2, "المدينة مطلوبة"),
  street: z.string().min(2, "العنوان مطلوب"),
  postalCode: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صالح"),
})

export type AddressInput = z.infer<typeof addressSchema>
