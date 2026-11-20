import { PageHeader } from "@/components/dashboard/shared/page-header"
import { StatCard } from "@/components/dashboard/shared/stat-card"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { ExportSalesButton } from "@/components/dashboard/reports/export-button"
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  FileBarChart,
} from "lucide-react"
import { connectDB } from "@/lib/db"
import { buildReportSummary } from "@/lib/analytics"

export const dynamic = "force-dynamic"

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  processing: "قيد المعالجة",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  completed: "مكتمل",
  cancelled: "ملغي",
  refunded: "مُسترد",
  returned: "مُرتجع",
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(n)
}

export default async function ReportsPage() {
  await connectDB()
  const summary = await buildReportSummary()

  return (
    <div className="space-y-6">
      <PageHeader
        title="التقارير"
        description="مؤشرات حية من المبيعات والمخزون والطلبات."
      />

      <div className="flex justify-end">
        <ExportSalesButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="إجمالي الإيرادات"
          value={formatCurrency(summary.totalRevenue)}
          hint={`المدفوع: ${formatCurrency(summary.paidRevenue)}`}
          icon={DollarSign}
          accent="green"
        />
        <StatCard
          label="عدد الطلبات"
          value={summary.orderCount}
          hint={`متوسط الطلب: ${formatCurrency(summary.averageOrderValue)}`}
          icon={ShoppingCart}
          accent="blue"
        />
        <StatCard
          label="قيمة المخزون"
          value={formatCurrency(summary.inventoryValue)}
          hint={`${summary.inventoryCount} منتج`}
          icon={Package}
          accent="orange"
        />
        <StatCard
          label="منتجات منخفضة المخزون"
          value={summary.lowStock.length}
          hint="أقل من أو يساوي 5"
          icon={AlertTriangle}
          accent="red"
        />
        <StatCard
          label="أكثر منتج مبيعاً"
          value={summary.topProducts[0]?.name ?? "—"}
          hint={summary.topProducts[0] ? `${summary.topProducts[0].units} وحدة` : "لا يوجد"}
          icon={TrendingUp}
          accent="yellow"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">الطلبات حسب الحالة</h2>
          {summary.ordersByStatus.length === 0 ? (
            <EmptyState title="لا توجد طلبات" description="ستظهر إحصائيات الطلبات هنا." />
          ) : (
            <ul className="space-y-2">
              {summary.ordersByStatus.map((s) => (
                <li key={s.status} className="flex items-center justify-between text-sm">
                  <span className="text-[#475569]">
                    {STATUS_LABELS[s.status] ?? s.status}
                  </span>
                  <span className="font-semibold text-[#1E293B]">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">المنتجات الأكثر مبيعاً</h2>
          {summary.topProducts.length === 0 ? (
            <EmptyState title="لا توجد مبيعات" description="ستظهر المنتجات الأكثر مبيعاً هنا." />
          ) : (
            <table className="w-full text-sm">
              <thead className="text-[#64748B]">
                <tr>
                  <th className="py-2 text-right font-medium">المنتج</th>
                  <th className="py-2 text-right font-medium">الوحدات</th>
                  <th className="py-2 text-right font-medium">الإيراد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {summary.topProducts.map((p) => (
                  <tr key={p.sku}>
                    <td className="py-2 text-[#1E293B]">{p.name}</td>
                    <td className="py-2 text-[#475569]">{p.units}</td>
                    <td className="py-2 text-[#475569]">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1E293B]">
          <FileBarChart className="size-5 text-[#F58220]" />
          تنبيهات المخزون
        </h2>
        {summary.lowStock.length === 0 ? (
          <EmptyState title="المخزون جيد" description="لا توجد منتجات منخفضة المخزون." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[#64748B]">
              <tr>
                <th className="py-2 text-right font-medium">المنتج</th>
                <th className="py-2 text-right font-medium">SKU</th>
                <th className="py-2 text-right font-medium">المخزون</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {summary.lowStock.map((p) => (
                <tr key={p.sku}>
                  <td className="py-2 text-[#1E293B]">{p.name}</td>
                  <td className="py-2 text-[#475569]">{p.sku}</td>
                  <td className="py-2">
                    <span className="rounded-full bg-[#DC2626]/10 px-2 py-1 text-xs text-[#DC2626]">
                      {p.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
