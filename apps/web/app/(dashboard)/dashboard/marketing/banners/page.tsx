import Link from "next/link"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"

export default function BannersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="بانرات الصفحة الرئيسية" description="إدارة الشرائح المعروضة للعملاء." />
      <EmptyState title="قريباً" description="ستتوفر إدارة البانرات الرئيسية قريباً." />
      <Link href="/dashboard/marketing" className="text-sm text-[#0F3B73] hover:underline">
        ← العودة للتسويق
      </Link>
    </div>
  )
}
