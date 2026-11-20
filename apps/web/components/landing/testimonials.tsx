import Image from "next/image"
import { Star } from "lucide-react"
import type { PublicTestimonial } from "@/repositories/testimonial.repository"
import { cn } from "@/lib/utils"
import { Section, SectionTitle } from "./section"

export interface TestimonialsProps {
  testimonials: PublicTestimonial[]
}

/**
 * Testimonials — dynamic (published + verified, sorted by `sortOrder`).
 * Style: name, company/role, rating stars, quote, optional avatar + date (design §3.2).
 */
export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <Section className="bg-canvas">
      <SectionTitle eyebrow="آراء عملائنا" title="ماذا يقول عملاؤنا" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.slug ?? t.name} testimonial={t} />
        ))}
      </div>
    </Section>
  )
}

export function TestimonialCard({ testimonial }: { testimonial: PublicTestimonial }) {
  const initial = testimonial.name.trim().charAt(0)
  const stars = Array.from({ length: 5 }).map((_, i) => i < testimonial.rating)

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <div className="flex gap-1">
        {stars.map((star, i) => (
          <Star
            key={i}
            className={cn("size-4", star ? "fill-accent text-accent" : "text-line")}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <blockquote className="text-sm leading-relaxed text-ink">{testimonial.comment}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {testimonial.avatarUrl ? (
            <Image
              src={testimonial.avatarUrl}
              alt={testimonial.name}
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
            />
          ) : (
            initial
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
          <p className="text-xs text-muted">{testimonial.role}</p>
        </div>
      </figcaption>
    </article>
  )
}
