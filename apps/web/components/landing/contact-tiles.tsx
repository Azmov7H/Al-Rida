import { Mail, MapPin, Phone } from "lucide-react"
import { IconTile } from "@/components/ui/icon-tile"
import type { CompanyData } from "@/types/company"

export interface ContactTilesProps {
  company: Pick<CompanyData, "phone" | "email" | "address">
}

/** Contact tiles: phone, email, address (larger, defensive). */
export function ContactTiles({ company }: ContactTilesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-line bg-surface px-6 py-8 shadow-sm">
        <IconTile icon={<Phone className="size-6" />} tone="primary" />
        <p className="mt-4 font-semibold text-ink">{company.phone}</p>
        <p className="mt-1 text-sm text-muted">رقم تواصلنا الرئيسي</p>
      </div>
      <div className="rounded-2xl border border-line bg-surface px-6 py-8 shadow-sm">
        <IconTile icon={<Mail className="size-6" />} tone="muted" />
        <p className="mt-4 font-semibold text-ink">{company.email}</p>
        <p className="mt-1 text-sm text-muted">بريدنا الرسمي</p>
      </div>
      <div className="rounded-2xl border border-line bg-surface px-6 py-8 shadow-sm">
        <IconTile icon={<MapPin className="size-6" />} tone="primary" />
        <p className="mt-4 font-semibold text-ink">{[company.address.street, company.address.city, company.address.governorate, company.address.country].filter(Boolean).join("، ")}</p>
        <p className="mt-1 text-sm text-muted">موقعنا الحقيقي</p>
      </div>
    </div>
  )
}
