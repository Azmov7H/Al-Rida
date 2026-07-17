import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"

export default function ContactMessagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="رسائل التواصل" description="صندور رسائل العملاء والاستفسارات." />
      <EmptyState
        title="لا توجد رسائل"
        description="ستظهر رسائل التواصل هنا بمجرد تفعيل حفظ الرسائل في قاعدة البيانات."
      />
    </div>
  )
}
