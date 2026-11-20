import { Section, SectionTitle } from "./section"
import { whyUs } from "@/lib/landing-data"

export function WhyUs() {
  return (
    <Section className="bg-[#F8FAFC]">
      <SectionTitle eyebrow="لماذا شركة الرضا" title="لماذا تختار شركة الرضا" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whyUs.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#0F3B73]/10 text-[#0F3B73]">
              <item.icon className="size-6" strokeWidth={1.5} />
            </span>
            <h3 className="text-lg font-semibold text-[#1E293B]">{item.title}</h3>
            <p className="text-sm text-[#64748B]">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
