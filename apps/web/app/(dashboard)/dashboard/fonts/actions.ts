"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { getSession } from "@/lib/auth/session"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"
import { brandSettingsRepository } from "@/repositories/brand-settings.repository"

const fontsSchema = z.object({
  primaryArabicFont: z.enum(["cairo", "readexPro"]),
})

export async function updateFontsAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/fonts")
  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "updateFontsAction" })
    redirect("/dashboard/fonts?error=csrf")
  }
  const parsed = fontsSchema.safeParse({
    primaryArabicFont: formData.get("primaryArabicFont"),
  })
  if (!parsed.success) {
    redirect("/dashboard/fonts?error=validation")
  }
  try {
    await brandSettingsRepository.upsertDefault({ primaryArabicFont: parsed.data.primaryArabicFont })
    const session = await getSession()
    await audit({
      actorId: session?.id,
      actorEmail: session?.email,
      action: "fonts.update",
      target: "brand-settings",
      metadata: { primaryArabicFont: parsed.data.primaryArabicFont },
    })
  } catch (err) {
    logger.error("fonts_update_failed", err)
    redirect("/dashboard/fonts?error=validation")
  }
  revalidatePath("/")
  redirect("/dashboard/fonts")
}
