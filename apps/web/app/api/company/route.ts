import { NextResponse } from "next/server"
import { rateLimit, clientKey } from "@/lib/security/rate-limit"
import { companyService } from "@/services/company.service"

/** Public: company settings (all fields are public business data). */
export async function GET(request: Request) {
  const rl = rateLimit(clientKey("company", request), 10, 60_000)
  if (!rl.success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }
  const company = await companyService.getDefault()
  return NextResponse.json(company, { headers: { "Cache-Control": "public, max-age=60" } })
}
