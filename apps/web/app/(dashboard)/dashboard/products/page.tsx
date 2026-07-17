import Link from "next/link"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Badge } from "@/components/dashboard/shared/badge"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { formatCurrency } from "@/lib/utils"
import { connectDB } from "@/lib/db"
import { productRepository } from "@/repositories/product.repository"
import type { IProduct } from "@/models/product"

export const dynamic = "force-dynamic"

const STATUS_TONE: Record<string, "gray" | "green" | "blue" | "orange" | "red"> = {
  active: "green",
  draft: "gray",
  out_of_stock: "orange",
  archived: "red",
}
const STATUS_LABEL: Record<string, string> = {
  active: "نشط",
  draft: "مسودة",
  out_of_stock: "غير متوفر",
  archived: "مؤرشف",
}

async function loadProducts() {
  try {
    await connectDB()
    const { items } = await productRepository.list({}, 1, 50)
    return items as IProduct[]
  } catch {
    return [] as IProduct[]
  }
}

export default async function DashboardProductsPage() {
  const products = await loadProducts()

  return (
    <div className="space-y-6">
      <PageHeader
        title="المنتجات"
        description="إدارة كتالوج منتجات أجهزة الأبواب."
        action={{ label: "إضافة منتج", href: "/dashboard/products/new" }}
      />

      {products.length === 0 ? (
        <EmptyState
          title="لا توجد منتجات"
          description="ابدأ بإضافة منتج جديد إلى الكتالوج."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-right text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B]">
              <tr>
                <th className="px-4 py-3 font-medium">المنتج</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">السعر</th>
                <th className="px-4 py-3 font-medium">المخزون</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {products.map((p) => (
                <tr key={p._id?.toString()} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-medium text-[#1E293B]">{p.name}</td>
                  <td className="px-4 py-3 text-[#64748B]">{p.sku}</td>
                  <td className="px-4 py-3 text-[#1E293B]">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3 text-[#64748B]">{p.stock}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[p.status] ?? "gray"}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <Link
                      href={`/dashboard/products/${p._id?.toString()}`}
                      className="text-sm font-medium text-[#0F3B73] hover:underline"
                    >
                      تحرير
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
