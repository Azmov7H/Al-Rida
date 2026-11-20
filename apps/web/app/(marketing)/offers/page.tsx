import type { Metadata } from "next"
import { Tag, Truck, ShieldCheck, Percent } from "lucide-react"

export const metadata: Metadata = {
  title: "العروض",
  description: "عروض وخصومات على أدوات الأبواب والآقفال الأصلية لفترة محدودة.",
}

const OFFERS = [
  {
    icon: Percent,
    title: "خصم 15% على الأقفال الذكية",
    description: "خصم على تشكيلة الأقفال الذكية المختارة لفترة محدودة.",
  },
  {
    icon: Truck,
    title: "شحن مجاني",
    description: "شحن مجاني للطلبات فوق قيمة معينة داخل الجمهورية.",
  },
  {
    icon: ShieldCheck,
    title: "ضمان ممتد",
    description: "ضمان إضافي عند شراء تشكيلة العلامات المعتمدة.",
  },
  {
    icon: Tag,
    title: "باقات المشاريع",
    description: "أسعار خاصة للمقاولين والمشاريع الكبرى.",
  },
]

export default function OffersPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">العروض</h1>
        <p className="mt-2 text-[#64748B]">استفد من أحدث العروض والخصومات على منتجاتنا الأصلية.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {OFFERS.map((o) => {
          const Icon = o.icon
          return (
            <div
              key={o.title}
              className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#F58220]/10 text-[#F58220]">
                <Icon className="size-6" />
              </span>
              <h3 className="text-lg font-semibold text-[#1E293B]">{o.title}</h3>
              <p className="text-sm text-[#64748B]">{o.description}</p>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-center text-sm text-[#94A3B8]">
        العروض لفترة محدودة وقد تخضع للتغيير. تواصل معنا لمعرفة التفاصيل.
      </p>
    </div>
  )
}
