import { reviewRepository } from "@/repositories/review.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, created, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({
  product: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(1),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const product = searchParams.get("product")
  try {
    return ok(product ? await reviewRepository.listByProduct(product) : [])
  } catch {
    return serverError()
  }
}

export async function POST(request: Request) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const review = await reviewRepository.create({
      ...parsed.data,
      user: guard.session.id as unknown as import("mongoose").Types.ObjectId,
    })
    return created(review)
  } catch {
    return serverError()
  }
}
