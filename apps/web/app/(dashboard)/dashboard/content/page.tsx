import { PageHeader } from "@/components/dashboard/shared/page-header"

const SECTIONS = [
  "الصفحة الرئيسية (Hero)",
  "البانرات",
  "صفحة من نحن",
  "صفحة التواصل",
  "الأسئلة الشائعة",
  "الفوتر",
  "معلومات الشركة",
]

export default function WebsiteContentPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="محتوى الموقع" description="إدارة المحتوى الظاهر للعملاء." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <div
            key={s}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm text-sm font-medium text-[#1E293B]"
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}
