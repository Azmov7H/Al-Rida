"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { couponRepository } from "@/repositories/coupon.repository"

export async function createCouponAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/marketing/coupons")

  const code = ((formData.get("code") as string) || "").trim().toUpperCase()
  const type = (formData.get("type") as string) || "percentage"
  const value = Number(formData.get("value"))
  const minSubtotal = formData.get("minSubtotal") ? Number(formData.get("minSubtotal")) : undefined
  const maxUses = formData.get("maxUses") ? Number(formData.get("maxUses")) : undefined
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : undefined

  if (!code || !["percentage", "fixed"].includes(type) || Number.isNaN(value)) {
    redirect("/dashboard/marketing/coupons?error=invalid")
  }

  try {
    await couponRepository.create({
      code,
      type,
      value,
      minSubtotal,
      maxUses,
      expiresAt,
      active: true,
    })
    revalidatePath("/dashboard/marketing/coupons")
  } catch {
    redirect("/dashboard/marketing/coupons?error=save")
  }
  redirect("/dashboard/marketing/coupons")
}

export async function toggleCouponAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/marketing/coupons")

  const id = (formData.get("id") as string) || ""
  const active = formData.get("active") === "true"
  try {
    await couponRepository.update(id, { active: !active })
    revalidatePath("/dashboard/marketing/coupons")
  } catch {
    redirect("/dashboard/marketing/coupons?error=save")
  }
  redirect("/dashboard/marketing/coupons")
}

export async function deleteCouponAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/marketing/coupons")

  const id = (formData.get("id") as string) || ""
  try {
    await couponRepository.remove(id)
    revalidatePath("/dashboard/marketing/coupons")
  } catch {
    redirect("/dashboard/marketing/coupons?error=save")
  }
  redirect("/dashboard/marketing/coupons")
}
