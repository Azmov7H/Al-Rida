import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Badge } from "@/components/dashboard/shared/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { connectDB } from "@/lib/db"
import { orderRepository } from "@/repositories/order.repository"
import { updateOrderStatusAction } from "@/app/(dashboard)/dashboard/orders/actions"
import type { IOrder } from "@/models/order"

export const dynamic = "force-dynamic"

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
  "returned",
]

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

async function load(id: string) {
  try {
    await connectDB()
    return await orderRepository.findById(id)
  } catch {
    return null
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = (await load(id)) as IOrder | null
  if (!order) notFound()

  const boundAction = updateOrderStatusAction.bind(null, id)

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F3B73]"
      >
        <ArrowLeft className="size-4" /> العودة للطلبات
      </Link>
      <PageHeader
        title={`طلب ${order.orderNumber}`}
        description={formatCurrency(order.total)}
        action={{ label: "طباعة الفاتورة", href: "#" }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">المنتجات</h2>
          <ul className="divide-y divide-[#F1F5F9]">
            {order.items.map((it, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">{it.name}</p>
                  <p className="text-xs text-[#94A3B8]">
                    {it.sku} · {it.quantity} × {formatCurrency(it.price)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#1E293B]">
                  {formatCurrency(it.total)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-[#F1F5F9] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[#64748B]">المجموع الفرعي</span>
              <span className="font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">الشحن</span>
              <span className="font-medium">{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-[#F1F5F9] pt-2 text-base font-bold">
              <span>الإجمالي</span>
              <span className="text-[#0F3B73]">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-[#1E293B]">الحالة</h2>
            <div className="mb-3 flex items-center gap-2">
              <Badge tone={TONE[order.status] ?? "gray"}>{order.status}</Badge>
              <Badge tone={order.paymentStatus === "paid" ? "green" : "yellow"}>
                {order.paymentStatus}
              </Badge>
            </div>
            <form action={boundAction} className="flex flex-col gap-2">
              <select
                name="status"
                defaultValue={order.status}
                className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm">
                تحديث الحالة
              </Button>
            </form>
          </section>

          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-[#1E293B]">سجل الحالة</h2>
            <ul className="space-y-3">
              {order.timeline.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 size-2 rounded-full bg-[#0F3B73]" />
                  <div>
                    <p className="font-medium text-[#1E293B]">{t.status}</p>
                    <p className="text-xs text-[#94A3B8]">
                      {new Date(t.timestamp).toLocaleString("ar-EG")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
