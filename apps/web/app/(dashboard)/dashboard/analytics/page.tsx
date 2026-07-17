import { PageHeader } from "@/components/dashboard/shared/page-header"
import { StatCard } from "@/components/dashboard/shared/stat-card"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { BarChart3, Users, Package, Boxes } from "lucide-react"

export const dynamic = "force-dynamic"

async function fetchJSON(url: string): Promise<unknown[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${url}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data?.series ?? json?.data?.top ?? json?.data ?? null
  } catch {
    return null
  }
}

export default async function AnalyticsPage() {
  const [sales, products, customers, inventory] = await Promise.all([
    fetchJSON("/api/analytics/sales"),
    fetchJSON("/api/analytics/products"),
    fetchJSON("/api/analytics/customers"),
    fetchJSON("/api/analytics/inventory"),
  ])

  const hasData =
    (sales && sales.length > 0) ||
    (products && products.length > 0) ||
    (customers && customers.length > 0) ||
    (inventory && inventory.length > 0)

  return (
    <div className="space-y-6">
      <PageHeader title="التحليلات" description="مؤشرات الأداء والاتجاهات." />

      {!hasData ? (
        <EmptyState
          title="لا توجد بيانات تحليلية بعد"
          description="ترتبط التحليلات ببيانات حية من قاعدة البيانات وستظهر هنا بمجرد اكتمال مسارات التجميع."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="المبيعات" value={(sales as unknown[])?.length ?? 0} icon={BarChart3} />
          <StatCard label="المنتجات" value={(products as unknown[])?.length ?? 0} icon={Package} accent="orange" />
          <StatCard label="العملاء" value={(customers as unknown[])?.length ?? 0} icon={Users} accent="green" />
          <StatCard label="المخزون" value={(inventory as unknown[])?.length ?? 0} icon={Boxes} accent="red" />
        </div>
      )}
    </div>
  )
}
