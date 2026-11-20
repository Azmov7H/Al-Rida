"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { getSession } from "@/lib/auth/session"
import { userRepository } from "@/repositories/user.repository"
import { logActivity } from "@/lib/activity"
import { ROLES, hasRole, type Role } from "@/constants/roles"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"

export async function updateUserRoleAction(formData: FormData) {
  const guard = await requireRole("admin")
  if ("response" in guard) redirect("/dashboard/users")

  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "updateUserRoleAction" })
    redirect("/dashboard/users?error=csrf")
  }

  const id = (formData.get("id") as string) || ""
  const role = formData.get("role") as Role

  if (!ROLES.includes(role)) redirect("/dashboard/users?error=invalid")

  const session = await getSession()
  // Prevent an admin from demoting or locking themselves out.
  if (session && id === session.id && !hasRole(role, "admin")) {
    redirect("/dashboard/users?error=self")
  }

  const target = await userRepository.findById(id)

  try {
    await userRepository.update(id, { role })
    void logActivity({
      actor: session?.name ?? "مدير",
      actorRole: "admin",
      action: "role.changed",
      entity: "user",
      entityId: id,
      message: `تم تغيير دور ${target?.name ?? id} إلى ${role}`,
    })
    await audit({
      actorId: session?.id,
      actorRole: "admin",
      action: "user.role.changed",
      target: "user",
      targetId: id,
      metadata: { from: target?.role, to: role },
    })
    revalidatePath("/dashboard/users")
    revalidatePath("/dashboard/roles")
  } catch {
    redirect("/dashboard/users?error=save")
  }
  redirect("/dashboard/roles")
}
