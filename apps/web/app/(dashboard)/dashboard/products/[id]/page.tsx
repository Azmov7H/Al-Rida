import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { ProductForm } from "@/components/dashboard/products/product-form"
import { updateProductAction } from "@/app/(dashboard)/dashboard/products/actions"
import { connectDB } from "@/lib/db"
import { productRepository } from "@/repositories/product.repository"
import { brandRepository } from "@/repositories/brand.repository"
import { categoryRepository } from "@/repositories/category.repository"

export const dynamic = "force-dynamic"

async function load(id: string) {
  try {
    await connectDB()
    const [product, brands, categories] = await Promise.all([
      productRepository.findById(id),
      brandRepository.list(),
      categoryRepository.list(),
    ])
    return { product, brands, categories }
  } catch {
    return { product: null, brands: [], categories: [] }
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { product, brands, categories } = await load(id)
  if (!product) notFound()

  const boundAction = updateProductAction.bind(null, id)

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F3B73]"
      >
        <ArrowLeft className="size-4" /> العودة للمنتجات
      </Link>
      <PageHeader title="تحرير المنتج" description={product.name} />
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <ProductForm
          brands={brands}
          categories={categories}
          product={product}
          formAction={boundAction}
        />
      </div>
    </div>
  )
}
