import type { Metadata } from "next"
import { connectDB } from "@/lib/db"
import { categoryRepository } from "@/repositories/category.repository"

export const metadata: Metadata = {
  title: "الفئات",
  description: "تصفح فئات أدوات الأبواب — كوالين، أوكر، مفصلات، أقفال ذكية، وإكسسوارات.",
}

export const dynamic = "force-dynamic"

async function loadCategories() {
  try {
    await connectDB()
    return await categoryRepository.list()
  } catch {
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await loadCategories()

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">الفئات</h1>
        <p className="mt-2 text-[#64748B]">استكشف منتجاتنا حسب الفئة.</p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center text-[#64748B]">
          لا توجد فئات لعرضها حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c._id?.toString()}
              className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-[#1E293B]">{c.name}</p>
                <p className="mt-1 text-xs text-[#94A3B8]">/{c.slug}</p>
              </div>
              <span className="rounded-full bg-[#0F3B73]/10 px-3 py-1 text-xs font-medium text-[#0F3B73]">
                استكشف
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
