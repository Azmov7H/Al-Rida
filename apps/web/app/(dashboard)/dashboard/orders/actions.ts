"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { orderRepository } from "@/repositories/order.repository"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"

export async function updateOrderStatusAction(id: string, formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect(`/dashboard/orders/${id}`)

  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "updateOrderStatusAction" })
    redirect(`/dashboard/orders/${id}?error=csrf`)
  }

  const status = (formData.get("status") as string) || ""
  try {
    await orderRepository.updateStatus(id, status as never)
    await audit({
      actorRole: "manager",
      action: "order.placed",
      target: "order",
      targetId: id,
      metadata: { status },
    })
    revalidatePath(`/dashboard/orders/${id}`)
    revalidatePath("/dashboard/orders")
  } catch {
    redirect(`/dashboard/orders/${id}?error=save`)
  }
  redirect(`/dashboard/orders/${id}`)
}
