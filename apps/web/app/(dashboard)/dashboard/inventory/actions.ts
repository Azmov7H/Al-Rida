"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { productRepository } from "@/repositories/product.repository"

export async function adjustStockAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/inventory")

  const id = (formData.get("productId") as string) || ""
  const delta = Number(formData.get("delta"))
  try {
    const product = await productRepository.findById(id)
    if (!product) redirect("/dashboard/inventory?error=notfound")
    const next = Math.max(0, product!.stock + delta)
    await productRepository.update(id, { stock: next })
    revalidatePath("/dashboard/inventory")
  } catch {
    redirect("/dashboard/inventory?error=save")
  }
  redirect("/dashboard/inventory")
}
