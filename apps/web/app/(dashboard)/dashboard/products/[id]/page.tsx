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
    if (!product) return { product: null, brands: [], categories: [] }
    const plainProduct = {
      _id: product._id?.toString(),
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      barcode: product.barcode,
      brand: product.brand?.toString(),
      category: product.category?.toString(),
      price: product.price,
      salePrice: product.salePrice,
      cost: product.cost,
      stock: product.stock,
      material: product.material,
      finish: product.finish,
      country: product.country,
      warranty: product.warranty,
      tags: product.tags,
      status: product.status,
    }
    return {
      product: plainProduct,
      brands: brands.map((b) => ({ _id: b._id?.toString(), name: b.name, slug: b.slug })),
      categories: categories.map((c) => ({
        _id: c._id?.toString(),
        name: c.name,
        slug: c.slug,
      })),
    }
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
