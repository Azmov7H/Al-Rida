import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { companyService } from "@/services/company.service"

export const metadata: Metadata = {
  title: { default: "الإعدادات", template: "%s · الرضا" },
  description: "إعدادات المتجر والإشعارات — معلومات الشركة في الصفحة الرئيسية.",
}

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const company = await companyService.getDefault()

  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعدادات"
        description="إعدادات المتجر والإشعارات."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">معلومات الشركة</h2>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <p><span className="font-semibold text-ink">الاسم:</span> {company.name}</p>
            <p><span className="font-semibold text-ink">الهاتف:</span> {company.phone}</p>
            <p><span className="font-semibold text-ink">الخطاب الرسمي:</span> {company.email}</p>
          </div>
          <Link href="/dashboard/company" className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
            تعديل معلومات الشركة
          </Link>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">الخدمات على الصفحة الرئيسية</h2>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <p>• آراء Google Maps (مؤشر خارجي)</p>
            <p>• InstaPay</p>
            <p>• المحفظة النقدية + نسخ الرقم</p>
            <p>• واتساب</p>
            <p>• الموقع الرسمي</p>
          </div>
          <Link href="/dashboard/links" className="mt-4 inline-flex h-11 items-center justify-center rounded-lg border border-line px-6 text-sm font-semibold text-ink transition-colors hover:bg-bg">
            إدارة الروابط
          </Link>
        </section>
      </div>
    </div>
  )
}
