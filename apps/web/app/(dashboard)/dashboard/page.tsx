import Link from "next/link"
import {
  Package,
  ShoppingCart,
  CircleDollarSign,
  Clock,
  AlertTriangle,
  UserPlus,
  ArrowLeft,
  Plus,
} from "lucide-react"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { StatCard } from "@/components/dashboard/shared/stat-card"
import { Badge } from "@/components/dashboard/shared/badge"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { formatCurrency } from "@/lib/utils"
import { productRepository } from "@/repositories/product.repository"
import { orderRepository } from "@/repositories/order.repository"
import { connectDB } from "@/lib/db"
import { companyService } from "@/services/company.service"
import { linkRepository } from "@/repositories/link.repository"
import { testimonialRepository } from "@/repositories/testimonial.repository"
import { House, Star, Link2 } from "lucide-react"
import type { IProduct } from "@/models/product"
import type { IOrder } from "@/models/order"

export const dynamic = "force-dynamic"

const ORDER_STATUS_TONE: Record<string, "gray" | "blue" | "green" | "orange" | "red" | "yellow"> = {
  pending: "yellow",
  confirmed: "blue",
  packed: "blue",
  shipped: "orange",
  delivered: "green",
  cancelled: "red",
  refunded: "red",
}

async function loadHome() {
  try {
    await connectDB()
    const [products, orders, lowStock, recentOrders, allLinks, unpublishedTestimonials, company] = await Promise.all([
      productRepository.list({}, 1, 1),
      orderRepository.listForAdmin(1, 1),
      productRepository.list({ stock: { $lte: 5 } }, 1, 5),
      orderRepository.listForAdmin(1, 6),
      linkRepository.list(),
      testimonialRepository.countUnpublished(),
      companyService.getDefault(),
    ])
    return {
      totals: {
        products: products.total,
        orders: orders.total,
        revenue: 0,
        pending: 0,
        lowStock: lowStock.total,
        customers: 0,
      },
      lowStock: lowStock.items as IProduct[],
      recentOrders: (recentOrders.items as IOrder[]).slice(0, 5),
      linksCount: allLinks.length,
      activeLinks: allLinks.filter((l) => l.enabled).length,
      unpublishedTestimonials,
      companyName: company.name,
    }
  } catch {
    return {
      totals: {
        products: 0,
        orders: 0,
        revenue: 0,
        pending: 0,
        lowStock: 0,
        customers: 0,
      },
      lowStock: [] as IProduct[],
      recentOrders: [] as IOrder[],
      linksCount: 0,
      activeLinks: 0,
      unpublishedTestimonials: 0,
      companyName: "الرضا",
    }
  }
}

const SPARK = [40, 55, 48, 70, 62, 85, 78, 95, 88, 100, 92, 110]

export default async function DashboardHomePage() {
  const data = await loadHome()
  const { linksCount, activeLinks, unpublishedTestimonials } = data

  return (
    <div className="space-y-6">
      <PageHeader
        title="الرئيسية"
        description="نظرة عامة على أداء المتجر والعمليات."
        action={{ label: "إضافة منتج", href: "/dashboard/products/new" }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="المنتجات" value={data.totals.products} icon={Package} />
        <StatCard label="الطلبات" value={data.totals.orders} icon={ShoppingCart} accent="orange" />
        <StatCard label="الإيرادات" value={formatCurrency(data.totals.revenue)} icon={CircleDollarSign} accent="green" />
        <StatCard label="الطلبات المعلقة" value={data.totals.pending} icon={Clock} accent="yellow" />
        <StatCard label="منتجات منخفضة المخزون" value={data.totals.lowStock} icon={AlertTriangle} accent="red" />
        <StatCard label="عملاء جدد" value={data.totals.customers} icon={UserPlus} accent="blue" />
      </div>

      {/* ── خدمة الشركة (P4) ── */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">خدمة الشركة</h2>
            <p className="text-sm text-muted">إدارة الروابط والتقييمات والعنوان على الصفحة الرئيسية</p>
          </div>
          <Link href="/dashboard/company" className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:underline">
            معلومات الشركة ←
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="الروابط" value={linksCount} icon={Link2} />
          <StatCard label="آراء العملاء" value={unpublishedTestimonials} icon={Star} />
          <StatCard label="الروابط المفعّلة" value={activeLinks} icon={House} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1E293B]">اتجاه المبيعات</h2>
            <span className="text-xs text-[#94A3B8]">آخر 12 شهراً</span>
          </div>
          <div className="flex h-40 items-end gap-2">
            {SPARK.map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-[#0F3B73]/80" style={{ height: `${h}%` }} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">إجراءات سريعة</h2>
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/products/new"
              className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm font-medium text-[#1E293B] transition-colors hover:bg-[#F8FAFC]"
            >
              إضافة منتج <Plus className="size-4 text-[#0F3B73]" />
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm font-medium text-[#1E293B] transition-colors hover:bg-[#F8FAFC]"
            >
              مراجعة الطلبات <ArrowLeft className="size-4 text-[#0F3B73]" />
            </Link>
            <Link
              href="/dashboard/brands/new"
              className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm font-medium text-[#1E293B] transition-colors hover:bg-[#F8FAFC]"
            >
              إضافة علامة تجارية <Plus className="size-4 text-[#0F3B73]" />
            </Link>
            <Link
              href="/dashboard/categories/new"
              className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm font-medium text-[#1E293B] transition-colors hover:bg-[#F8FAFC]"
            >
              إضافة فئة <Plus className="size-4 text-[#0F3B73]" />
            </Link>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1E293B]">أحدث الطلبات</h2>
            <Link href="/dashboard/orders" className="text-sm font-medium text-[#0F3B73]">
              عرض الكل
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <EmptyState title="لا توجد طلبات بعد" />
          ) : (
            <ul className="divide-y divide-[#F1F5F9]">
              {data.recentOrders.map((o) => (
                <li key={o._id?.toString()} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1E293B]">{o.orderNumber}</p>
                    <p className="text-xs text-[#94A3B8]">
                      طلب · {formatCurrency(o.total)}
                    </p>
                  </div>
                  <Badge tone={ORDER_STATUS_TONE[o.status] ?? "gray"}>
                    {o.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1E293B]">منتجات منخفضة المخزون</h2>
            <Link href="/dashboard/inventory" className="text-sm font-medium text-[#0F3B73]">
              إدارة المخزون
            </Link>
          </div>
          {data.lowStock.length === 0 ? (
            <EmptyState title="مخزون ممتاز" description="لا توجد منتجات منخفضة المخزون." />
          ) : (
            <ul className="divide-y divide-[#F1F5F9]">
              {data.lowStock.map((p) => (
                <li key={p._id?.toString()} className="flex items-center justify-between py-3">
                  <p className="text-sm font-medium text-[#1E293B]">{p.name}</p>
                  <Badge tone={p.stock === 0 ? "red" : "orange"}>المتبقي: {p.stock}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
