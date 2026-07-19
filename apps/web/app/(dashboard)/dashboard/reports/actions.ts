"use server"

import { requireRole } from "@/lib/auth/guard"
import { buildSalesCsv } from "@/lib/analytics"

export async function exportSalesCsvAction(): Promise<{ url: string }> {
  const guard = await requireRole("manager")
  if ("response" in guard) return { url: "" }

  const csv = await buildSalesCsv()
  const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
  return { url: dataUrl }
}
