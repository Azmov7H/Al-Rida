"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { contentRepository } from "@/repositories/content.repository"

export async function updateContentAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/content")

  const section = (formData.get("section") as string) || ""
  const raw = (formData.get("data") as string) || ""

  if (!section) redirect("/dashboard/content?error=invalid")

  let data: Record<string, unknown>
  try {
    data = raw ? JSON.parse(raw) : {}
  } catch {
    redirect("/dashboard/content?error=invalid")
  }

  try {
    await contentRepository.upsert(section, data)
    revalidatePath("/")
    revalidatePath("/dashboard/content")
  } catch {
    redirect("/dashboard/content?error=save")
  }
  redirect("/dashboard/content")
}
