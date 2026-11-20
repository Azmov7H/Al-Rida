import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { Button } from "@/components/ui/button"
import { connectDB } from "@/lib/db"
import { brandRepository } from "@/repositories/brand.repository"
import { createBrandAction } from "@/app/(dashboard)/dashboard/brands/actions"

export const dynamic = "force-dynamic"

async function load() {
  try {
    await connectDB()
    return await brandRepository.list()
  } catch {
    return []
  }
}

export default async function BrandsPage() {
  const brands = await load()

  return (
    <div className="space-y-6">
      <PageHeader
        title="العلامات التجارية"
        description="إدارة علامات تصنيع أجهزة الأبواب."
        action={{ label: "إضافة علامة", href: "/dashboard/brands?new=1" }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
          {brands.length === 0 ? (
            <EmptyState title="لا توجد علامات تجارية" />
          ) : (
            <ul className="divide-y divide-[#F1F5F9]">
              {brands.map((b) => (
                <li key={b._id?.toString()} className="flex items-center justify-between py-3">
                  <p className="text-sm font-medium text-[#1E293B]">{b.name}</p>
                  <span className="text-xs text-[#94A3B8]">/{b.slug}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">علامة جديدة</h2>
          <form action={createBrandAction} className="grid gap-3">
            <input name="name" required placeholder="الاسم" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
            <input name="slug" placeholder="الرابط (اختياري)" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
            <input name="logo" placeholder="رابط الشعار (اختياري)" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
            <Button type="submit" size="md">
              إنشاء
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
