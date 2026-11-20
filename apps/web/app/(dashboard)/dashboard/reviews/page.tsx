import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Badge } from "@/components/dashboard/shared/badge"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { connectDB } from "@/lib/db"
import { reviewRepository } from "@/repositories/review.repository"
import type { IReview } from "@/models/review"

export const dynamic = "force-dynamic"

async function load() {
  try {
    await connectDB()
    return await reviewRepository.list(1, 50)
  } catch {
    return [] as IReview[]
  }
}

export default async function ReviewsPage() {
  const reviews = await load()

  return (
    <div className="space-y-6">
      <PageHeader title="التقييمات" description="مراجعة وتعديل تقييمات العملاء." />

      {reviews.length === 0 ? (
        <EmptyState title="لا توجد تقييمات" />
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li
              key={r._id?.toString()}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#1E293B]">{r.title ?? "تقييم"}</p>
                <Badge tone="yellow">{"★".repeat(r.rating)}</Badge>
              </div>
              <p className="mt-2 text-sm text-[#64748B]">{r.comment}</p>
              <p className="mt-2 text-xs text-[#94A3B8]">
                {new Date(r.createdAt).toLocaleDateString("ar-EG")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
