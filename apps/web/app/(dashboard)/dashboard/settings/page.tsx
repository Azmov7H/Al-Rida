import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="الإعدادات" description="إعدادات المتجر والدفع والإشعارات." />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">عام</h2>
          <div className="grid gap-3">
            <input name="companyName" placeholder="اسم الشركة" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
            <input name="contactEmail" type="email" placeholder="البريد المرجعي" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
            <Button size="sm">حفظ</Button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">الدفع</h2>
          <ul className="space-y-2 text-sm text-[#475569]">
            <li className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3">
              <span>الدفع عند الاستلام</span>
              <span className="text-[#16A34A]">مُفعّل</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3">
              <span>Paymob</span>
              <span className="text-[#94A3B8]">قيد الإعداد</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3">
              <span>Stripe</span>
              <span className="text-[#94A3B8]">قيد الإعداد</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
