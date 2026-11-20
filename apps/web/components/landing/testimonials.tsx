import { Star } from "lucide-react"
import { Section, SectionTitle } from "./section"
import { testimonials } from "@/lib/landing-data"

export function Testimonials() {
  return (
    <Section className="bg-[#F8FAFC]">
      <SectionTitle eyebrow="آراء العملاء" title="ماذا يقول عملاؤنا" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
          >
            <div className="flex gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-[#F58220] text-[#F58220]" />
              ))}
            </div>
            <blockquote className="text-sm leading-relaxed text-[#1E293B]">
              {t.review}
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#0F3B73] text-sm font-semibold text-white">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1E293B]">{t.name}</p>
                <p className="text-xs text-[#64748B]">{t.company}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
