import { NextResponse } from "next/server"
import { rateLimit, clientKey } from "@/lib/security/rate-limit"
import { linkRepository } from "@/repositories/link.repository"

/** Public: landing action links (enabled, sorted). */
export async function GET(request: Request) {
  const rl = rateLimit(clientKey("links", request), 10, 60_000)
  if (!rl.success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }
  const links = await linkRepository.listBySectionEnabled("main_actions")
  return NextResponse.json(links, { headers: { "Cache-Control": "public, max-age=60" } })
}
