"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { brandRepository } from "@/repositories/brand.repository"
import { slugify } from "@/lib/utils"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"

export async function createBrandAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/brands")

  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "createBrandAction" })
    redirect("/dashboard/brands?error=csrf")
  }

  const name = (formData.get("name") as string) || ""
  try {
    const created = await brandRepository.create({
      name,
      slug: (formData.get("slug") as string) || slugify(name),
      logo: (formData.get("logo") as string) || undefined,
    })
    await audit({
      actorRole: "manager",
      action: "brand.created",
      target: "brand",
      targetId: created?._id?.toString(),
    })
    revalidatePath("/dashboard/brands")
  } catch {
    redirect("/dashboard/brands?error=save")
  }
  redirect("/dashboard/brands")
}
