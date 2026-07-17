import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { Button } from "@/components/ui/button"
import { FileBarChart } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    { key: "sales", label: "تقرير المبيعات" },
    { key: "products", label: "تقرير المنتجات" },
    { key: "categories", label: "تقرير الفئات" },
    { key: "brands", label: "تقرير العلامات" },
    { key: "customers", label: "تقرير العملاء" },
    { key: "inventory", label: "تقرير المخزون" },
    { key: "revenue", label: "تقرير الإيرادات" },
  ]
  return (
    <div className="space-y-6">
      <PageHeader title="التقارير" description="تصدير التقارير بصيغ Excel و CSV و PDF." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <div
            key={r.key}
            className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#0F3B73]/10 text-[#0F3B73]">
                <FileBarChart className="size-5" />
              </span>
              <span className="text-sm font-medium text-[#1E293B]">{r.label}</span>
            </div>
            <Button size="sm" variant="outline">
              تصدير
            </Button>
          </div>
        ))}
      </div>
      <EmptyState
        title="التصدير قيد التطوير"
        description="ستتوفر ملفات Excel و CSV و PDF بعد ربط مسارات التقارير بالبيانات الحية."
      />
    </div>
  )
}
