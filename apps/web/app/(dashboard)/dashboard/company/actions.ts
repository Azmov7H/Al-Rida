"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { getSession } from "@/lib/auth/session"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"
import { companyService } from "@/services/company.service"
import type { CompanyData } from "@/types/company"

function get(formData: FormData, key: string): string | undefined {
  const v = formData.get(key)
  return typeof v === "string" && v.trim() ? v.trim() : undefined
}

export async function updateCompanyAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/company")
  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "updateCompanyAction" })
    redirect("/dashboard/company?error=csrf")
  }

  const input: Parameters<typeof companyService.updateCompany>[0] = {
    name: get(formData, "name") as string,
    description: get(formData, "description") as string,
    websiteUrl: get(formData, "websiteUrl") as string,
    googleMapsReviewUrl: get(formData, "googleMapsReviewUrl") as string,
    instaPayLink: get(formData, "instaPayLink") as string,
    cashWalletNumber: get(formData, "cashWalletNumber") as string,
    cashWalletLabel: get(formData, "cashWalletLabel") as string,
    cashWalletInstructions: get(formData, "cashWalletInstructions") as string,
    phone: get(formData, "phone") as string,
    whatsappNumber: get(formData, "whatsappNumber") as string,
    email: get(formData, "email") as string,
    address: {
      street: get(formData, "addressStreet") as string,
      city: get(formData, "addressCity") as string,
      governorate: get(formData, "addressGovernorate") as string,
      country: get(formData, "addressCountry") as string,
      postalCode: get(formData, "addressPostalCode"),
    },
    googleMapsUrl: get(formData, "googleMapsUrl") as string,
    primaryArabicFont: get(formData, "primaryArabicFont") as string,
  }

  try {
    const session = await getSession()
    const company: CompanyData = await companyService.updateCompany(input)
    await audit({
      actorId: session?.id,
      actorEmail: session?.email,
      actorRole: session?.role,
      action: "company.update",
      target: "company",
      targetId: company.slug,
      metadata: { changed: Object.keys(input).filter(Boolean) },
    })
    revalidatePath("/")
    redirect("/dashboard/company")
  } catch (err) {
    logger.error("company_update_failed", err)
    redirect("/dashboard/company?error=validation")
  }
}
