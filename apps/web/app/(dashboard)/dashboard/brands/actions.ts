"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { brandRepository } from "@/repositories/brand.repository"
import { slugify } from "@/lib/utils"

export async function createBrandAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/brands")

  const name = (formData.get("name") as string) || ""
  try {
    await brandRepository.create({
      name,
      slug: (formData.get("slug") as string) || slugify(name),
      logo: (formData.get("logo") as string) || undefined,
    })
    revalidatePath("/dashboard/brands")
  } catch {
    redirect("/dashboard/brands?error=save")
  }
  redirect("/dashboard/brands")
}
