import Link from "next/link"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="العروض الترويجية" description="تخفيضات موسمية ومحددة الوقت." />
      <EmptyState title="قريباً" description="ستتوفر إدارة العروض الترويجية قريباً." />
      <Link href="/dashboard/marketing" className="text-sm text-[#0F3B73] hover:underline">
        ← العودة للتسويق
      </Link>
    </div>
  )
}
