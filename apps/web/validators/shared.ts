import { z } from "zod"

/** https-only URL (http://localhost allowed in dev). */
export const httpsUrl = (maxLength: number) =>
  z
    .string()
    .url("URL invalid")
    .max(maxLength)
    .refine(
      (v) => v.startsWith("https://") || v.startsWith("http://localhost"),
      { message: "URL must use https (http://localhost allowed in dev)" },
    )

export const E164 = /^\+[0-9]{7,15}$/

/** Display phone: ≤30 chars with digits. */
export const phoneDisplay = z.string().trim().min(5).max(30).regex(/[0-9]/u, "رقم الهاتف غير صالح")
