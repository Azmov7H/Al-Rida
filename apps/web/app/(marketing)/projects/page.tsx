import type { Metadata } from "next"
import { MapPin } from "lucide-react"
import { projects } from "@/lib/landing-data"

export const metadata: Metadata = {
  title: "المشاريع",
  description: "مشاريع نفذناها بمنتجاتنا الأصلية من أقفال وأوكر ومفصلات في مواقع متنوعة.",
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">المشاريع</h1>
        <p className="mt-2 text-[#64748B]">نماذج من المشاريع التي زودناها بأدوات الأبواب الأصلية.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.name}
            className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#1E293B]">{p.name}</h3>
            <p className="flex items-center gap-1.5 text-sm text-[#64748B]">
              <MapPin className="size-4 text-[#F58220]" />
              {p.location}
            </p>
            <p className="text-sm text-[#475569]">{p.products}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
