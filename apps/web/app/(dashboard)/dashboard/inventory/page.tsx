import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Badge } from "@/components/dashboard/shared/badge"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { Button } from "@/components/ui/button"
import { connectDB } from "@/lib/db"
import { productRepository } from "@/repositories/product.repository"
import { adjustStockAction } from "@/app/(dashboard)/dashboard/inventory/actions"
import type { IProduct } from "@/models/product"

export const dynamic = "force-dynamic"

async function load() {
  try {
    await connectDB()
    const { items } = await productRepository.list({}, 1, 100)
    return items as IProduct[]
  } catch {
    return [] as IProduct[]
  }
}

export default async function InventoryPage() {
  const products = await load()

  return (
    <div className="space-y-6">
      <PageHeader title="المخزون" description="متابعة وتعديل مخزون المنتجات." />

      {products.length === 0 ? (
        <EmptyState title="لا توجد منتجات" description="أضف منتجات لإدارة مخزونها." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B]">
              <tr>
                <th className="px-4 py-3 font-medium">المنتج</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">المخزون</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">تعديل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {products.map((p) => (
                <tr key={p._id?.toString()} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-medium text-[#1E293B]">{p.name}</td>
                  <td className="px-4 py-3 text-[#64748B]">{p.sku}</td>
                  <td className="px-4 py-3 text-[#1E293B]">{p.stock}</td>
                  <td className="px-4 py-3">
                    {p.stock === 0 ? (
                      <Badge tone="red">نفد</Badge>
                    ) : p.stock <= 5 ? (
                      <Badge tone="orange">منخفض</Badge>
                    ) : (
                      <Badge tone="green">متوفر</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <form action={adjustStockAction} className="flex items-center gap-2">
                      <input type="hidden" name="productId" value={p._id?.toString()} />
                      <input
                        type="number"
                        name="delta"
                        placeholder="الفرق"
                        defaultValue={1}
                        className="h-9 w-20 rounded-lg border border-[#E2E8F0] px-2 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
                      />
                      <Button type="submit" size="sm" variant="outline">
                        تحديث
                      </Button>
                    </form>
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
