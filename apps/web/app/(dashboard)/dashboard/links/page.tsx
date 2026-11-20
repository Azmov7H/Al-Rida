import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { CreateForm } from "@/components/dashboard/links/create-form"
import { LinksTable } from "@/components/dashboard/links/links-table"
import { linkRepository } from "@/repositories/link.repository"
import type { ILinkItem } from "@/types/link"

export const metadata: Metadata = {
  title: { default: "الروابط", template: "%s · الرضا" },
  description: "إدارة الروابط التي تظهر على الصفحة الرئيسية (Google Maps, InstaPay, المحفظة، واتساب، الموقع).",
}

export const dynamic = "force-dynamic"

export default async function LinksPage() {
  const links = await linkRepository.list()
  return (
    <div className="space-y-6">
      <PageHeader
        title="الروابط"
        description="إدارة الروابط التي تظهر على الصفحة الرئيسية (Google Maps, InstaPay, المحفظة، واتساب، الموقع)."
      />
      <CreateForm />
      <LinksTable initialLinks={links as ILinkItem[]} />
    </div>
  )
}
