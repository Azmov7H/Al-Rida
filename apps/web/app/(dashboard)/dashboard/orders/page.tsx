import Link from "next/link"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Badge } from "@/components/dashboard/shared/badge"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { formatCurrency } from "@/lib/utils"
import { connectDB } from "@/lib/db"
import { orderRepository } from "@/repositories/order.repository"
import type { IOrder } from "@/models/order"

export const dynamic = "force-dynamic"

const TONE: Record<string, "gray" | "blue" | "green" | "orange" | "red" | "yellow"> = {
  pending: "yellow",
  confirmed: "blue",
  processing: "blue",
  shipped: "orange",
  delivered: "green",
  completed: "green",
  cancelled: "red",
  refunded: "red",
  returned: "red",
}

async function load() {
  try {
    await connectDB()
    const { items } = await orderRepository.listForAdmin(1, 30)
    return items as IOrder[]
  } catch {
    return [] as IOrder[]
  }
}

export default async function OrdersPage() {
  const orders = await load()

  return (
    <div className="space-y-6">
      <PageHeader title="الطلبات" description="متابعة وإدارة طلبات العملاء." />

      {orders.length === 0 ? (
        <EmptyState title="لا توجد طلبات" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B]">
              <tr>
                <th className="px-4 py-3 font-medium">رقم الطلب</th>
                <th className="px-4 py-3 font-medium">الإجمالي</th>
                <th className="px-4 py-3 font-medium">الدفع</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {orders.map((o) => (
                <tr key={o._id?.toString()} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-medium text-[#1E293B]">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-[#1E293B]">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3 text-[#64748B]">{o.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <Badge tone={TONE[o.status] ?? "gray"}>{o.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <Link
                      href={`/dashboard/orders/${o._id?.toString()}`}
                      className="text-sm font-medium text-[#0F3B73] hover:underline"
                    >
                      عرض
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
