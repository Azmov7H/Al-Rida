import type { Metadata } from "next"
import { connectDB } from "@/lib/db"
import { testimonialRepository } from "@/repositories/testimonial.repository"
import { upsertTestimonialAction, deleteTestimonialAction, togglePublishedAction, toggleVerifiedAction } from "@/app/(dashboard)/dashboard/testimonials/actions"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { CsrfToken } from "@/components/security/csrf-token"
import { Button } from "@/components/ui/button"
import type { ITestimonial } from "@/models/testimonial"

export const metadata: Metadata = {
  title: { default: "آراء عملائنا", template: "%s · الرضا" },
  description: "إدارة آراء العملاء: الإضافة، التعديل، النشر/إيقاف النشر، التحقق، المراجعة.",
}

export const dynamic = "force-dynamic"

async function loadTestimonials(filter?: { isPublished?: boolean; isVerified?: boolean }) {
  await connectDB()
  const all = await testimonialRepository.getAll(filter)
  const pending = await testimonialRepository.countUnpublished()
  return { testimonials: all as ITestimonial[], pendingReviews: pending }
}

export default async function TestimonialsPage() {
  const { testimonials, pendingReviews } = await loadTestimonials()

  return (
    <div className="space-y-6">
      <PageHeader
        title="آراء عملائنا"
        description={pendingReviews ? `${pendingReviews} تقييم غير موثوق به — يحتاج مراجعة.` : "آراء العملاء (ناشرة + موثوقة). آراء Google Maps يتم التعامل معها خارجياً."}
      />

      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-ink">إضافة تقييم جديد</h2>
        <form action={upsertTestimonialAction} className="grid gap-3 md:grid-cols-2">
          <CsrfToken />
          <input name="name" placeholder="اسم العميل" required className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
          <input name="role" placeholder="الصف/الشركة" className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
          <input name="rating" type="number" min={1} max={5} defaultValue={5} placeholder="التقييم (1–5)" required className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
          <textarea name="comment" placeholder="نص التقييم" rows={3} required className="w-full resize-none rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
          <input name="avatarUrl" placeholder="رابط صورة الشخصية (اختياري)" className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
          <label className="inline-flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="isPublished" value="true" className="size-4 accent-primary" />
            نشر فوري
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="isVerified" value="true" className="size-4 accent-primary" />
            موثوق (يظهر على الصفحة)
          </label>
          <Button type="submit" variant="primary">إضافة تقييم</Button>
        </form>
      </section>

      <div className="rounded-2xl border border-line bg-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-right text-xs font-semibold uppercase text-muted">
              <th className="p-3">الاسم</th>
              <th className="p-3">الصف</th>
              <th className="p-3">التقييم</th>
              <th className="p-3">النص</th>
              <th className="p-3">الحالة</th>
              <th className="p-3 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {testimonials.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-muted">لا توجد آراء بعد.</td></tr>
            ) : null}
            {testimonials.map((t) => (
              <TestimonialRow key={t.slug ?? t._id.toString()} testimonial={t} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestimonialRow({ testimonial }: { testimonial: ITestimonial }) {
  const isPublished = testimonial.isPublished
  return (
    <tr className="hover:bg-bg/50">
      <td className="p-3 font-semibold text-ink">{testimonial.name}</td>
      <td className="p-3 text-muted">{testimonial.role ?? "—"}</td>
      <td className="p-3 text-muted">{"★".repeat(testimonial.rating) + "☆".repeat(5 - testimonial.rating)}</td>
      <td className="p-3 text-sm text-muted">{testimonial.comment}</td>
      <td className="p-3 text-center">
        <form action={togglePublishedAction.bind(null, testimonial.slug ?? "", !testimonial.isPublished)}>
          <button type="submit" className={`inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold transition-colors ${isPublished ? "bg-success/10 text-success hover:bg-success/20" : "bg-muted/10 text-muted hover:bg-muted/20"}`}>
            {isPublished ? "منشورة" : "غير منشورة"}
          </button>
        </form>
        <form action={toggleVerifiedAction.bind(null, testimonial.slug ?? "", !testimonial.isVerified)}>
          <button type="submit" className="mt-1.5 inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold transition-colors bg-muted/10 text-muted hover:bg-muted/20">
            {testimonial.isVerified ? "موثقة" : "غير موثوقة"}
          </button>
        </form>
      </td>
      <td className="p-3 text-center">
        <form action={deleteTestimonialAction.bind(null, testimonial.slug ?? testimonial._id.toString())}>
          <button type="submit" onClick={(e) => { if (!confirm("حذف هذا التقييم؟")) e.preventDefault() }} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-ink">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </form>
      </td>
    </tr>
  )
}
