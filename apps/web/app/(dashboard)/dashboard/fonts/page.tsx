import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { CsrfToken } from "@/components/security/csrf-token"
import { brandSettingsRepository } from "@/repositories/brand-settings.repository"
import { updateFontsAction } from "@/app/(dashboard)/dashboard/fonts/actions"

export const metadata: Metadata = {
  title: { default: "الخطوط", template: "%s · الرضا" },
  description: "تغيير الخط العربي الأساسي (Cairo / Readex Pro) للصفحة الرئيسية مع معاينة.",
}

export const dynamic = "force-dynamic"

const FONT_OPTIONS = [
  {
    value: "cairo",
    label: "Cairo (400–800)",
    sample: "أوكر الأبواب · الأقفال · حلول مثلية للأعمال اليدوية المحترفة — Al-Reda",
    mono: false,
  },
  {
    value: "readexPro",
    label: "Readex Pro (400–700)",
    sample: "أوكر الأبواب · الأقفال · حلول مثلية للأعمال اليدوية المحترفة — Al-Reda",
    mono: false,
  },
]

export default async function FontsPage() {
  const settings = await brandSettingsRepository.getOrCreateDefault()

  return (
    <div className="space-y-6">
      <PageHeader
        title="الخطوط"
        description="تغيير الخط العربي الأساسي للصفحة الرئيسية مع معاينة حية (Cairo / Readex Pro)."
      />

      <form action={updateFontsAction} className="space-y-5">
        <CsrfToken />
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">الخط الحالي: {settings.primaryArabicFont === "readexPro" ? "Readex Pro" : "Cairo"}</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {FONT_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{option.label}</p>
                  <p className="text-xs text-muted">{option.sample}</p>
                </div>
                <input
                  type="radio"
                  name="primaryArabicFont"
                  value={option.value}
                  defaultChecked={settings.primaryArabicFont === option.value}
                  className="size-4 accent-primary"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-7 text-base font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            حفظ الخط
          </button>
        </div>
      </form>
    </div>
  )
}
