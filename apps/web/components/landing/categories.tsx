import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Section, SectionTitle } from "./section"
import { categories } from "@/lib/landing-data"
import { categoryImage } from "@/lib/images"

export function Categories() {
  return (
    <Section className="bg-[#F8FAFC]">
      <SectionTitle eyebrow="تصفح" title="الفئات" description="استعرض منتجاتنا حسب الفئة." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <Image
              src={categoryImage(cat.name)}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-20 transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="relative mb-2 flex size-11 items-center justify-center rounded-lg bg-[#0F3B73]/10 text-[#0F3B73]">
              <ArrowLeft className="size-5" />
            </span>
            <span className="relative text-lg font-semibold text-[#1E293B] group-hover:text-[#0F3B73]">
              {cat.name}
            </span>
            <span className="relative text-sm text-[#64748B]">{cat.count} منتج</span>
          </Link>
        ))}
      </div>
    </Section>
  )
}
