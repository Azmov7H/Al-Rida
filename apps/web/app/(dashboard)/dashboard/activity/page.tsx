import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="سجل النشاطات" description="تتبع عمليات المستخدمين والتغييرات." />
      <EmptyState
        title="لا توجد سجلات بعد"
        description="سيتم تسجيل دخول المستخدمين والتغييرات على المنتجات والطلبات هنا."
      />
    </div>
  )
}
