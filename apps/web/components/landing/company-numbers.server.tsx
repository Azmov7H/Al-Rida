import { getContent } from "@/services/content.service"
import { StatCounters } from "@/components/landing/company-numbers"

export async function CompanyNumbers() {
  const c = await getContent("statistics")
  const items = (c.items as { label: string; value: number; suffix: string }[]) ?? []
  return <StatCounters statistics={items} />
}
