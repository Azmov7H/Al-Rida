import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Input } from "@/components/ui/input"
import { CsrfToken } from "@/components/security/csrf-token"
import { updateCompanyAction } from "@/app/(dashboard)/dashboard/company/actions"
import { companyService } from "@/services/company.service"

export const metadata: Metadata = {
  title: { default: "معلومات الشركة", template: "%s · الرضا" },
  description: "إدارة معلومات الشركة: الاسم، الوصف، الخطابات، المواقع، المحفظة والخطوط.",
}

export const dynamic = "force-dynamic"

function Field({ label, name, type, required, value, hint, error }: {
  label: string
  name: string
  type?: string
  required?: boolean
  value?: string
  hint?: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink" htmlFor={name}>{label}</label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={value}
        className="mt-0"
      />
      {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  )
}

export default async function CompanyPage() {
  const company = await companyService.getDefault()

  return (
    <div className="space-y-6">
      <PageHeader
        title="معلومات الشركة"
        description="إدارة الاسم، الوصف، الخطابات، المواقع، المحفظة النقدية، الخطوط والعنوان."
        action={{ label: "مشاهدة الصفحة الرئيسية ←", href: "/" }}
      />

      <form action={updateCompanyAction} className="space-y-6">
        <CsrfToken />
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">المعلومات الأساسية</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="اسم الشركة" name="name" required value={company.name} />
            <Field label="الوصف" name="description" required value={company.description} hint="يظهر على الصفحة الرئيسية" />
            <Field label="رقم الهاتف" name="phone" type="tel" required value={company.phone} />
            <Field label="رقم واتساب (E.164)" name="whatsappNumber" type="tel" required value={company.whatsappNumber} hint="ابدأ بـ +20" />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">أرشيف الخطابات</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="البريد الرسمي" name="email" type="email" required value={company.email} />
            <Field label="رابط الموقع الرسمي" name="websiteUrl" required value={company.websiteUrl} />
            <Field label="رابط مراجعات Google Maps" name="googleMapsReviewUrl" required value={company.googleMapsReviewUrl} />
            <Field label="رابط InstaPay" name="instaPayLink" required value={company.instaPayLink} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">المحفظة النقدية</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="الرقم" name="cashWalletNumber" required value={company.cashWalletNumber} hint="E.164-like (يجب أن يبدأ بـ +20)" />
            <Field label="الاسم" name="cashWalletLabel" required value={company.cashWalletLabel} />
            <Field label="التعليمات" name="cashWalletInstructions" required value={company.cashWalletInstructions} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">العنوان والموقع الجغرافي</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="الشارع" name="addressStreet" required value={company.address.street} />
            <Field label="المدينة" name="addressCity" required value={company.address.city} />
            <Field label="المحافظة" name="addressGovernorate" required value={company.address.governorate} />
            <Field label="الدولة" name="addressCountry" required value={company.address.country} />
            <Field label="رمز البريد" name="addressPostalCode" value={company.address.postalCode ?? ""} />
            <Field label="رابط الخريطة" name="googleMapsUrl" required value={company.googleMapsUrl} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-base font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            حفظ الشركة
          </button>
        </div>
      </form>
    </div>
  )
}
