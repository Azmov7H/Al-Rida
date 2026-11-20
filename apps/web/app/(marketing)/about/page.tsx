import type { Metadata } from "next"
import { statistics, contactInfo } from "@/lib/landing-data"
import { TrustTiles } from "@/components/landing/trust-tiles"

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "الرضا لتجارة أدوات الأبواب — موزع معتمد لأوكر الأبواب والأقفال والكوالين، حلول أصلية عالي الجودة في السوق المصري.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-[#1E293B] md:text-4xl">من نحن</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[#64748B]">
          الرضا شريكك الموثوق في أدوات الأبواب والآقفال، نجمع بين جودة العلامات العالمية
          والخبرة المحلية لنقدم حلولاً متكاملة للمشاريع السكنية والتجارية في جميع أنحاء الجمهورية.
        </p>
      </section>

      <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statistics.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center shadow-sm"
          >
            <p className="text-3xl font-bold text-[#0F3B73]">
              {s.value}
              {s.suffix}
            </p>
            <p className="mt-1 text-xs text-[#64748B]">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mb-12">
        <TrustTiles />
      </section>

      <section className="rounded-2xl bg-[#0F3B73] p-8 text-center text-white">
        <h2 className="text-2xl font-bold">تواصل معنا</h2>
        <p className="mt-2 text-sm text-white/80">
          {contactInfo.address}
        </p>
        <p className="mt-1 text-sm text-white/80">
          {contactInfo.phone} · {contactInfo.email}
        </p>
      </section>
    </div>
  )
}
