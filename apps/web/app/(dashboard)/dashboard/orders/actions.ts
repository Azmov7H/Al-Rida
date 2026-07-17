"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { orderRepository } from "@/repositories/order.repository"

export async function updateOrderStatusAction(id: string, formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect(`/dashboard/orders/${id}`)
  const status = (formData.get("status") as string) || ""
  try {
    await orderRepository.updateStatus(id, status as never)
    revalidatePath(`/dashboard/orders/${id}`)
    revalidatePath("/dashboard/orders")
  } catch {
    redirect(`/dashboard/orders/${id}?error=save`)
  }
  redirect(`/dashboard/orders/${id}`)
}
