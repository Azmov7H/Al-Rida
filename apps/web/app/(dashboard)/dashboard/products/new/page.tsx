import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { ProductForm } from "@/components/dashboard/products/product-form"
import { createProductAction } from "@/app/(dashboard)/dashboard/products/actions"
import { connectDB } from "@/lib/db"
import { brandRepository } from "@/repositories/brand.repository"
import { categoryRepository } from "@/repositories/category.repository"
import { Badge } from "@/components/dashboard/shared/badge"

export const dynamic = "force-dynamic"

async function loadOptions() {
  try {
    await connectDB()
    const [brands, categories] = await Promise.all([
      brandRepository.list(),
      categoryRepository.list(),
    ])
    return {
      brands: brands.map((b) => ({ _id: b._id?.toString(), name: b.name, slug: b.slug })),
      categories: categories.map((c) => ({
        _id: c._id?.toString(),
        name: c.name,
        slug: c.slug,
      })),
    }
  } catch {
    return { brands: [], categories: [] }
  }
}

export default async function NewProductPage() {
  const { brands, categories } = await loadOptions()
  const error = null

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F3B73]"
      >
        <ArrowLeft className="size-4" /> العودة للمنتجات
      </Link>
      <PageHeader title="منتج جديد" description="أدخل تفاصيل المنتج وحدد حالته." />
      {error ? <Badge tone="red">تعذر الحفظ، تحقق من البيانات.</Badge> : null}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <ProductForm
          brands={brands}
          categories={categories}
          formAction={createProductAction}
        />
      </div>
    </div>
  )
}
