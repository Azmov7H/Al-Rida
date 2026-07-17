import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Button } from "@/components/ui/button"

const MODULES = [
  { name: "الكوبونات", desc: "إنشاء وإدارة رموز الخصم." },
  { name: "العروض الترويجية", desc: "تخفيضات موسمية ومحددة الوقت." },
  { name: "بانرات الصفحة الرئيسية", desc: "إدارة الشرائح المعروضة للعملاء." },
  { name: "المنتجات المميزة", desc: "تثبيت منتجات في الواجهة." },
  { name: "الإشعارات", desc: "إشعارات البريد والرسائل." },
  { name: "الحملات البريدية", desc: "حملات تسويقية للعملاء." },
]

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="التسويق" description="إدارة العروض والحملات والبانرات." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <div key={m.name} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#1E293B]">{m.name}</h2>
            <p className="mt-1 text-xs text-[#94A3B8]">{m.desc}</p>
            <Button size="sm" variant="outline" className="mt-4">
              إدارة
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
