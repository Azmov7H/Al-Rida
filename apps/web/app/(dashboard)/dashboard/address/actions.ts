"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/guard"
import { getSession } from "@/lib/auth/session"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"
import { companyService } from "@/services/company.service"

export async function updateAddressAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/address")
  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "updateAddressAction" })
    redirect("/dashboard/address?error=csrf")
  }

  const get = (key: string): string | undefined => {
    const v = formData.get(key)
    return typeof v === "string" && v.trim() ? v.trim() : undefined
  }

  const input = {
    address: {
      street: get("addressStreet") as string,
      city: get("addressCity") as string,
      governorate: get("addressGovernorate") as string,
      country: get("addressCountry") as string,
      postalCode: get("addressPostalCode"),
    },
    googleMapsUrl: get("googleMapsUrl") as string,
    coordinates: get("lat") && get("lng")
      ? { lat: Number(get("lat")), lng: Number(get("lng")) }
      : undefined,
  }

  try {
    const session = await getSession()
    const company = await companyService.updateCompany(input)
    await audit({
      actorId: session?.id,
      actorEmail: session?.email,
      action: "company.address_update",
      target: "company",
      targetId: company.slug,
    })
    revalidatePath("/")
  } catch (err) {
    logger.error("address_update_failed", err)
    redirect("/dashboard/address?error=validation")
  }
  redirect("/dashboard/address")
}
