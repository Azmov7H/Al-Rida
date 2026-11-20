import type { Metadata } from "next"
import { whyUs, statistics, contactInfo } from "@/lib/landing-data"

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "الرضا لتجارة أدوات الأبواب والآقفال — موزع معتمد لعلامات عالمية ومحلية بخبرة تمتد لعقود في السوق المصري.",
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
        <h2 className="mb-6 text-2xl font-bold text-[#1E293B]">لماذا تختار الرضا</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((w) => {
            const Icon = w.icon
            return (
              <div
                key={w.title}
                className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#0F3B73]/10 text-[#0F3B73]">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-lg font-semibold text-[#1E293B]">{w.title}</h3>
                <p className="text-sm text-[#64748B]">{w.description}</p>
              </div>
            )
          })}
        </div>
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
