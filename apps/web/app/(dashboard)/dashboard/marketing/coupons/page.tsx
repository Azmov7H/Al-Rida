import Link from "next/link"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { Button } from "@/components/ui/button"
import { connectDB } from "@/lib/db"
import { couponRepository } from "@/repositories/coupon.repository"
import {
  createCouponAction,
  toggleCouponAction,
  deleteCouponAction,
} from "@/app/(dashboard)/dashboard/marketing/coupons/actions"

export const dynamic = "force-dynamic"

export default async function CouponsPage() {
  await connectDB()
  const coupons = await couponRepository.list()

  return (
    <div className="space-y-6">
      <PageHeader title="الكوبونات" description="إنشاء وإدارة رموز الخصم." />

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">كوبون جديد</h2>
        <form action={createCouponAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            name="code"
            required
            placeholder="الكود (مثال: SAVE20)"
            className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
          <select
            name="type"
            className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          >
            <option value="percentage">نسبة مئوية %</option>
            <option value="fixed">مبلغ ثابت</option>
          </select>
          <input
            name="value"
            type="number"
            step="0.01"
            required
            placeholder="القيمة"
            className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
          <input
            name="minSubtotal"
            type="number"
            step="0.01"
            placeholder="الحد الأدنى للطلب (اختياري)"
            className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
          <input
            name="maxUses"
            type="number"
            placeholder="الحد الأقصى للاستخدام (اختياري)"
            className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
          <input
            name="expiresAt"
            type="date"
            placeholder="تاريخ الانتهاء"
            className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" size="md">
              إنشاء الكوبون
            </Button>
          </div>
        </form>
      </div>

      {coupons.length === 0 ? (
        <EmptyState title="لا توجد كوبونات" description="أضف أول كوبون خصم من النموذج أعلاه." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] text-[#64748B]">
              <tr>
                <th className="px-4 py-3 text-right font-medium">الكود</th>
                <th className="px-4 py-3 text-right font-medium">النوع</th>
                <th className="px-4 py-3 text-right font-medium">القيمة</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {coupons.map((c) => (
                <tr key={c._id.toString()}>
                  <td className="px-4 py-3 font-semibold text-[#1E293B]">{c.code}</td>
                  <td className="px-4 py-3 text-[#475569]">
                    {c.type === "percentage" ? "نسبة مئوية" : "مبلغ ثابت"}
                  </td>
                  <td className="px-4 py-3 text-[#475569]">
                    {c.type === "percentage" ? `${c.value}%` : c.value}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        c.active
                          ? "rounded-full bg-[#16A34A]/10 px-2 py-1 text-xs text-[#16A34A]"
                          : "rounded-full bg-[#94A3B8]/10 px-2 py-1 text-xs text-[#64748B]"
                      }
                    >
                      {c.active ? "مفعل" : "معطل"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <form action={toggleCouponAction}>
                        <input type="hidden" name="id" value={c._id.toString()} />
                        <input type="hidden" name="active" value={String(c.active)} />
                        <Button type="submit" size="sm" variant="outline">
                          {c.active ? "تعطيل" : "تفعيل"}
                        </Button>
                      </form>
                      <form action={deleteCouponAction}>
                        <input type="hidden" name="id" value={c._id.toString()} />
                        <Button type="submit" size="sm" variant="ghost" className="text-red-600">
                          حذف
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link href="/dashboard/marketing" className="text-sm text-[#0F3B73] hover:underline">
        ← العودة للتسويق
      </Link>
    </div>
  )
}
