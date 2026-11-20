import { reviewRepository } from "@/repositories/review.repository"
import { requireUser } from "@/lib/auth/guard"
import { ok, badRequest, notFound, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(1),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const { id } = await params
  const parsed = schema.partial().safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    const review = await reviewRepository.update(id, guard.session.id, parsed.data)
    if (!review) return notFound("Review not found.")
    return ok(review)
  } catch {
    return serverError()
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser()
  if ("response" in guard) return guard.response
  const { id } = await params
  try {
    await reviewRepository.remove(id, guard.session.id)
    return ok(null, "Review deleted.")
  } catch {
    return serverError()
  }
}
