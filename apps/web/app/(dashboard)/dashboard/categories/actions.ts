"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import mongoose from "mongoose"
import { requireRole } from "@/lib/auth/guard"
import { categoryRepository } from "@/repositories/category.repository"
import { slugify } from "@/lib/utils"

export async function createCategoryAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/categories")

  const name = (formData.get("name") as string) || ""
  const payload: Record<string, unknown> = {
    name,
    slug: (formData.get("slug") as string) || slugify(name),
    code: (formData.get("code") as string) || undefined,
    image: (formData.get("image") as string) || undefined,
  }
  const parent = formData.get("parent") as string
  if (parent) payload.parent = new mongoose.Types.ObjectId(parent)

  try {
    await categoryRepository.create(payload)
    revalidatePath("/dashboard/categories")
  } catch {
    redirect("/dashboard/categories?error=save")
  }
  redirect("/dashboard/categories")
}
