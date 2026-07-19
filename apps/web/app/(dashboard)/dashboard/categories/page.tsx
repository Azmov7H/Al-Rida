import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { connectDB } from "@/lib/db"
import { categoryRepository } from "@/repositories/category.repository"
import { createCategoryAction } from "@/app/(dashboard)/dashboard/categories/actions"
import { CategoryForm } from "@/components/dashboard/categories/category-form"

export const dynamic = "force-dynamic"

async function load() {
  try {
    await connectDB()
    const items = await categoryRepository.list()
    const byId = new Map(items.map((c) => [c._id?.toString(), c.name]))
    return { items, byId }
  } catch {
    return { items: [], byId: new Map() }
  }
}

export default async function CategoriesPage() {
  const { items, byId } = await load()

  return (
    <div className="space-y-6">
      <PageHeader
        title="الفئات"
        description="تنظيم المنتجات في فئات هرمية."
        action={{ label: "إضافة فئة", href: "/dashboard/categories?new=1" }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
          {items.length === 0 ? (
            <EmptyState title="لا توجد فئات" />
          ) : (
            <ul className="divide-y divide-[#F1F5F9]">
              {items.map((c) => (
                <li key={c._id?.toString()} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1E293B]">{c.name}</p>
                    <p className="text-xs text-[#94A3B8]">/{c.slug}</p>
                  </div>
                  <span className="text-xs text-[#64748B]">
                    {c.parent ? `أصل: ${byId.get(c.parent.toString()) ?? "—"}` : "فئة رئيسية"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">فئة جديدة</h2>
          <CategoryForm
            items={items.map((c) => ({ _id: c._id?.toString(), name: c.name }))}
            formAction={createCategoryAction}
          />
        </div>
      </div>
    </div>
  )
}
