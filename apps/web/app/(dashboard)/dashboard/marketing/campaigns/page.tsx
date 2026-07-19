import Link from "next/link"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="الحملات البريدية" description="حملات تسويقية للعملاء." />
      <EmptyState title="قريباً" description="ستتوفر إدارة الحملات البريدية قريباً." />
      <Link href="/dashboard/marketing" className="text-sm text-[#0F3B73] hover:underline">
        ← العودة للتسويق
      </Link>
    </div>
  )
}
