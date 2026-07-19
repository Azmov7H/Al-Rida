import Link from "next/link"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="الإشعارات" description="إشعارات البريد والرسائل." />
      <EmptyState title="قريباً" description="ستتوفر إدارة الإشعارات قريباً." />
      <Link href="/dashboard/marketing" className="text-sm text-[#0F3B73] hover:underline">
        ← العودة للتسويق
      </Link>
    </div>
  )
}
