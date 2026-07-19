import { PageHeader } from "@/components/dashboard/shared/page-header"
import { StatCard } from "@/components/dashboard/shared/stat-card"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import {
  BarChart3,
  Users,
  Package,
  Boxes,
  TrendingUp,
  Layers,
} from "lucide-react"
import { connectDB } from "@/lib/db"
import { buildAnalytics } from "@/lib/analytics"

export const dynamic = "force-dynamic"

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(n)
}

function BarList({
  items,
  format,
}: {
  items: { name: string; value: number }[]
  format: (n: number) => string
}) {
  const max = Math.max(1, ...items.map((i) => i.value))
  if (items.length === 0) {
    return <EmptyState title="لا توجد بيانات" description="ستظهر هنا بمجرد توفر المبيعات." />
  }
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i.name} className="text-sm">
          <div className="flex items-center justify-between">
            <span className="truncate text-[#475569]">{i.name}</span>
            <span className="font-semibold text-[#1E293B]">{format(i.value)}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#F1F5F9]">
            <div
              className="h-full rounded-full bg-[#0F3B73]"
              style={{ width: `${(i.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default async function AnalyticsPage() {
  await connectDB()
  const data = await buildAnalytics()

  const hasData =
    data.salesSeries.length > 0 ||
    data.categoryBreakdown.length > 0 ||
    data.brandBreakdown.length > 0 ||
    data.customerCount > 0

  const maxRevenue = Math.max(1, ...data.salesSeries.map((s) => s.revenue))

  return (
    <div className="space-y-6">
      <PageHeader title="التحليلات" description="مؤشرات الأداء والاتجاهات الحية." />

      {!hasData ? (
        <EmptyState
          title="لا توجد بيانات تحليلية بعد"
          description="ترتبط التحليلات ببيانات حية من قاعدة البيانات وستظهر هنا بمجرد وجود طلبات ومنتجات."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="العملاء" value={data.customerCount} hint={`${data.newCustomers} جديد (30 يوم)`} icon={Users} accent="green" />
            <StatCard label="المنتجات" value={data.categoryBreakdown.reduce((s, c) => s + c.products, 0)} icon={Package} accent="orange" />
            <StatCard label="طلبات مكتملة" value={data.conversion.orders} icon={Boxes} accent="red" />
            <StatCard
              label="معدل التحويل"
              value={`${(data.conversion.rate * 100).toFixed(1)}%`}
              hint={`${data.conversion.visitors} زيارة (تقديري)`}
              icon={TrendingUp}
              accent="yellow"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1E293B]">
                <BarChart3 className="size-5 text-[#0F3B73]" />
                سلسلة المبيعات اليومية
              </h2>
              {data.salesSeries.length === 0 ? (
                <EmptyState title="لا توجد مبيعات" description="ستظهر سلسلة المبيعات هنا." />
              ) : (
                <div className="flex h-40 items-end gap-1">
                  {data.salesSeries.map((s) => (
                    <div key={s.date} className="flex flex-1 flex-col items-center justify-end gap-1">
                      <span className="text-[10px] text-[#64748B]">
                        {formatCurrency(s.revenue).replace(/\s*EGP/, "")}
                      </span>
                      <div
                        className="w-full rounded-t bg-[#F58220]"
                        style={{ height: `${(s.revenue / maxRevenue) * 100}%`, minHeight: 4 }}
                        title={`${s.date}: ${formatCurrency(s.revenue)} (${s.orders} طلب)`}
                      />
                      <span className="text-[9px] text-[#94A3B8]">
                        {s.date.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1E293B]">
                <Layers className="size-5 text-[#F58220]" />
                الإيراد حسب الفئة
              </h2>
              <BarList
                items={data.categoryBreakdown.map((c) => ({ name: c.name, value: c.revenue }))}
                format={formatCurrency}
              />
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1E293B]">
                <Package className="size-5 text-[#0F3B73]" />
                الإيراد حسب العلامة التجارية
              </h2>
              <BarList
                items={data.brandBreakdown.map((b) => ({ name: b.name, value: b.revenue }))}
                format={formatCurrency}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
