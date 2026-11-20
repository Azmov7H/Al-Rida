import { NextResponse } from "next/server"
import { rateLimit, clientKey } from "@/lib/security/rate-limit"
import { testimonialRepository } from "@/repositories/testimonial.repository"
import { connectDB } from "@/lib/db"

/** Public: published + verified testimonials (safe projection). */
export async function GET(request: Request) {
  const rl = rateLimit(clientKey("testimonials", request), 10, 60_000)
  if (!rl.success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }
  await connectDB()
  const testimonials = await testimonialRepository.getPublishedVerified()
  return NextResponse.json(testimonials, { headers: { "Cache-Control": "public, max-age=60" } })
}
