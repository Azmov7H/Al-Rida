import Link from "next/link"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Button } from "@/components/ui/button"

const MODULES = [
  { name: "الكوبونات", desc: "إنشاء وإدارة رموز الخصم.", href: "/dashboard/marketing/coupons", ready: true },
  { name: "العروض الترويجية", desc: "تخفيضات موسمية ومحددة الوقت.", href: "/dashboard/marketing/promotions", ready: false },
  { name: "بانرات الصفحة الرئيسية", desc: "إدارة الشرائح المعروضة للعملاء.", href: "/dashboard/marketing/banners", ready: false },
  { name: "المنتجات المميزة", desc: "تثبيت منتجات في الواجهة.", href: "/dashboard/marketing/featured", ready: false },
  { name: "الإشعارات", desc: "إشعارات البريد والرسائل.", href: "/dashboard/marketing/notifications", ready: false },
  { name: "الحملات البريدية", desc: "حملات تسويقية للعملاء.", href: "/dashboard/marketing/campaigns", ready: false },
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
            <Link href={m.href} className="mt-4 inline-block">
              <Button size="sm" variant={m.ready ? "primary" : "outline"}>
                {m.ready ? "إدارة" : "قريباً"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
