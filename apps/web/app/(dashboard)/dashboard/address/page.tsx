import type { Metadata } from "next"
import Link from "next/link"
import { companyService } from "@/services/company.service"
import { updateAddressAction } from "@/app/(dashboard)/dashboard/address/actions"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { CsrfToken } from "@/components/security/csrf-token"

export const metadata: Metadata = {
  title: { default: "العنوان", template: "%s · الرضا" },
  description: "تحديث العنوان الفعلي ورابط الخريطة على الصفحة الرئيسية.",
}

export const dynamic = "force-dynamic"

function Field({ label, name, value, hint, error, type, step }: {
  label: string
  name: string
  value?: string
  hint?: string
  error?: string
  type?: string
  step?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={value}
        className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  )
}

export default async function AddressPage() {
  const company = await companyService.getDefault()

  return (
    <div className="space-y-6">
      <PageHeader
        title="العنوان والموقع الجغرافي"
        description="إدارة العنوان الفعلي ورابط Google Maps."
        action={{ label: "الرئيسية ←", href: "/dashboard" }}
      />

      <form action={updateAddressAction} className="space-y-6">
        <CsrfToken />
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">العنوان الفعلي</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="الشارع" name="addressStreet" value={company.address.street} />
            <Field label="المدينة" name="addressCity" value={company.address.city} />
            <Field label="المحافظة" name="addressGovernorate" value={company.address.governorate} />
            <Field label="الدولة" name="addressCountry" value={company.address.country} />
            <Field label="رمز البريد" name="addressPostalCode" value={company.address.postalCode ?? ""} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">الخريطة</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="رابط Google Maps" name="googleMapsUrl" value={company.googleMapsUrl} />
            <Field label="خط العرض (lat)" name="lat" type="number" step="0.00001" value={company.coordinates?.lat?.toFixed(6)} />
            <Field label="خط الطول (lng)" name="lng" type="number" step="0.00001" value={company.coordinates?.lng?.toFixed(6)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-7 text-base font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            حفظ العنوان
          </button>
          <Link href={company.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-lg border border-line px-6 text-sm font-semibold text-ink transition-colors hover:bg-bg">
            العرض على Google Maps
          </Link>
        </div>
      </form>
    </div>
  )
}
