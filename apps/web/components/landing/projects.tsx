import Image from "next/image"
import { Section, SectionTitle } from "./section"
import { projects } from "@/lib/landing-data"
import { projectImage } from "@/lib/images"

export function Projects() {
  return (
    <Section className="bg-white">
      <SectionTitle
        eyebrow="أعمالنا"
        title="المشاريع"
        description="نفذنا مشاريع متنوعة بمنتجات أصلية وموثوقة."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((p, i) => (
          <div
            key={p.name}
            className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={projectImage(i)}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#1E293B]">{p.name}</h3>
              <p className="text-sm text-[#64748B]">{p.location}</p>
              <p className="mt-2 text-xs text-[#64748B]">المنتجات: {p.products}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
