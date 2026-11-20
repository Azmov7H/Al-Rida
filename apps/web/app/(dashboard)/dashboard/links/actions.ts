"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { getSession } from "@/lib/auth/session"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"
import { linksService } from "@/services/links.service"
import type { ILinkItem, LinkItemCreate } from "@/types/link"

async function guardedAction(): Promise<{ error: true } | { session: Awaited<ReturnType<typeof getSession>> }> {
  const guard = await requireRole("manager")
  if ("response" in guard) return { error: true }
  return { session: await getSession() }
}

function getString(formData: FormData, key: string, fallback = ""): string {
  const v = formData.get(key)
  return typeof v === "string" ? v.trim() : fallback
}

export async function createLinkAction(formData: FormData) {
  const guard = await guardedAction()
  if ("error" in guard) {
    redirect("/dashboard/links")
  }
  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "createLinkAction" })
    redirect("/dashboard/links?error=csrf")
  }

  try {
    const data: LinkItemCreate = {
      title: getString(formData, "title"),
      description: getString(formData, "description") || undefined,
      url: getString(formData, "url"),
      iconKey: getString(formData, "iconKey") as ILinkItem["iconKey"],
      section: getString(formData, "section") as ILinkItem["section"],
      displayOrder: Number(formData.get("displayOrder") || 0),
      enabled: formData.get("enabled") === "true",
    }
    const link = await linksService.createLink(data)
    await audit({
      actorId: guard.session?.id,
      actorEmail: guard.session?.email,
      action: "link.create",
      target: "link",
      targetId: link.slug,
      metadata: { title: link.title },
    })
    revalidatePath("/")
  } catch (err) {
    logger.error("link_create_failed", err)
    redirect("/dashboard/links?error=validation")
  }
  redirect("/dashboard/links")
}

export async function updateLinkAction(slug: string, formData: FormData) {
  const guard = await guardedAction()
  if ("error" in guard) redirect("/dashboard/links")
  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "updateLinkAction" })
    redirect("/dashboard/links/edit/" + slug + "?error=csrf")
  }

  try {
    const data: LinkItemCreate = {
      title: getString(formData, "title"),
      description: getString(formData, "description") || undefined,
      url: getString(formData, "url"),
      iconKey: getString(formData, "iconKey") as ILinkItem["iconKey"],
      section: getString(formData, "section") as ILinkItem["section"],
      displayOrder: Number(formData.get("displayOrder") || 0),
      enabled: formData.get("enabled") === "true",
    }
    const link = await linksService.updateLink(slug, data)
    await audit({
      actorId: guard.session?.id,
      actorEmail: guard.session?.email,
      action: "link.update",
      target: "link",
      targetId: link.slug,
      metadata: { title: link.title },
    })
    revalidatePath("/")
  } catch (err) {
    logger.error("link_update_failed", err)
    redirect("/dashboard/links/edit/" + slug + "?error=validation")
  }
  redirect("/dashboard/links")
}

export async function deleteLinkAction(slug: string) {
  const guard = await guardedAction()
  if ("error" in guard) redirect("/dashboard/links")
  if (!(await verifyCsrfForAction(new FormData()))) {
    redirect("/dashboard/links?error=csrf")
  }
  try {
    await linksService.deleteLink(slug)
    await audit({
      actorId: guard.session?.id,
      actorEmail: guard.session?.email,
      action: "link.delete",
      target: "link",
      targetId: slug,
    })
    revalidatePath("/")
  } catch (err) {
    logger.error("link_delete_failed", err)
  }
  redirect("/dashboard/links")
}

export async function toggleLinkEnabledAction(slug: string, enabled: boolean) {
  const guard = await guardedAction()
  if ("error" in guard) redirect("/dashboard/links")
  if (!(await verifyCsrfForAction(new FormData()))) {
    redirect("/dashboard/links?error=csrf")
  }
  try {
    await linksService.setEnabled(slug, enabled)
    await audit({
      actorId: guard.session?.id,
      actorEmail: guard.session?.email,
      action: "link.toggle_enabled",
      target: "link",
      targetId: slug,
      metadata: { enabled },
    })
    revalidatePath("/")
  } catch (err) {
    logger.error("link_toggle_failed", err)
  }
  redirect("/dashboard/links")
}

export async function reorderLinksAction(slug: string, direction: 1 | -1) {
  const guard = await guardedAction()
  if ("error" in guard) redirect("/dashboard/links")
  if (!(await verifyCsrfForAction(new FormData()))) {
    redirect("/dashboard/links?error=csrf")
  }
  try {
    const link = await linksService.findBySlug(slug)
    if (!link) redirect("/dashboard/links")
    await linksService.reorderLinks([{ slug, displayOrder: link.displayOrder + direction }])
    await audit({
      actorId: guard.session?.id,
      actorEmail: guard.session?.email,
      action: "link.reorder",
      target: "link",
      targetId: slug,
      metadata: { direction },
    })
    revalidatePath("/")
  } catch (err) {
    logger.error("link_reorder_failed", err)
  }
  redirect("/dashboard/links")
}
