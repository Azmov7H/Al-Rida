import type { Metadata } from "next"
import { Mail, Phone, MapPin } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"
import { contactInfo } from "@/lib/landing-data"

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصل مع الرضا للاستفسار عن المنتجات والمشاريع والعروض.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">اتصل بنا</h1>
        <p className="mt-2 text-[#64748B]">نحن هنا للإجابة على استفساراتك.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#0F3B73]/10 text-[#0F3B73]">
              <Mail className="size-5" />
            </span>
            <div>
              <p className="text-xs text-[#94A3B8]">البريد</p>
              <p className="text-sm font-medium text-[#1E293B]">{contactInfo.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#0F3B73]/10 text-[#0F3B73]">
              <Phone className="size-5" />
            </span>
            <div>
              <p className="text-xs text-[#94A3B8]">الهاتف</p>
              <p className="text-sm font-medium text-[#1E293B]">{contactInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#0F3B73]/10 text-[#0F3B73]">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="text-xs text-[#94A3B8]">العنوان</p>
              <p className="text-sm font-medium text-[#1E293B]">{contactInfo.address}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
