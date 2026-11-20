"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { getSession } from "@/lib/auth/session"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"
import { testimonialService } from "@/services/testimonial.service"
import { testimonialPublicSchema } from "@/validators/testimonial"

async function guarded(page = "/dashboard/testimonials") {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect(page)
}

export async function upsertTestimonialAction(formData: FormData) {
  await guarded()
  if (!(await verifyCsrfForAction(formData))) {
    redirect("/dashboard/testimonials?error=csrf")
  }

  const id = formData.get("id") as string | undefined

  const parsed = testimonialPublicSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    rating: Number(formData.get("rating")),
    comment: formData.get("comment"),
    avatarUrl: formData.get("avatarUrl"),
  })
  if (!parsed.success) {
    redirect("/dashboard/testimonials?error=validation")
  }

  try {
    const session = await getSession()
    const testimonial = await testimonialService.upsert({ ...parsed.data, id })
    await audit({
      actorId: session?.id,
      actorEmail: session?.email,
      actorRole: session?.role,
      action: id ? "testimonial.update" : "testimonial.create",
      target: "testimonial",
      targetId: testimonial.slug ?? testimonial._id.toString(),
      metadata: { name: testimonial.name },
    })
    revalidatePath("/")
  } catch (err) {
    logger.error("testimonial_upsert_failed", err)
    redirect("/dashboard/testimonials?error=validation")
  }
  redirect("/dashboard/testimonials")
}

export async function deleteTestimonialAction(slug: string) {
  await guarded()
  if (!(await verifyCsrfForAction(new FormData()))) {
    redirect("/dashboard/testimonials?error=csrf")
  }
  try {
    await testimonialService.delete(slug)
    const session = await getSession()
    await audit({
      actorId: session?.id,
      actorEmail: session?.email,
      action: "testimonial.delete",
      target: "testimonial",
      targetId: slug,
    })
  } catch (err) {
    logger.error("testimonial_delete_failed", err)
  }
  revalidatePath("/")
  redirect("/dashboard/testimonials")
}

export async function togglePublishedAction(slug: string, isPublished: boolean) {
  await guarded()
  if (!(await verifyCsrfForAction(new FormData()))) {
    redirect("/dashboard/testimonials?error=csrf")
  }
  try {
    const session = await getSession()
    await testimonialService.setPublished(slug, isPublished)
    await audit({
      actorId: session?.id,
      actorEmail: session?.email,
      action: isPublished ? "testimonial.publish" : "testimonial.unpublish",
      target: "testimonial",
      targetId: slug,
    })
  } catch (err) {
    logger.error("testimonial_toggle_published_failed", err)
  }
  revalidatePath("/")
  redirect("/dashboard/testimonials")
}

export async function toggleVerifiedAction(slug: string, isVerified: boolean) {
  await guarded()
  if (!(await verifyCsrfForAction(new FormData()))) {
    redirect("/dashboard/testimonials?error=csrf")
  }
  try {
    const session = await getSession()
    await testimonialService.setVerified(slug, isVerified)
    await audit({
      actorId: session?.id,
      actorEmail: session?.email,
      action: isVerified ? "testimonial.verify" : "testimonial.unverify",
      target: "testimonial",
      targetId: slug,
    })
  } catch (err) {
    logger.error("testimonial_toggle_verified_failed", err)
  }
  revalidatePath("/")
  redirect("/dashboard/testimonials")
}
