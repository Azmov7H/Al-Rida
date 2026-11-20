import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { ContentEditor } from "@/components/dashboard/content/content-editor"
import { connectDB } from "@/lib/db"
import { contentRepository } from "@/repositories/content.repository"

export const dynamic = "force-dynamic"

const SECTION_TITLES: Record<string, string> = {
  hero: "الصفحة الرئيسية (Hero)",
  statistics: "الأرقام والإحصائيات",
  trust: "مؤشرات الثقة",
  footer: "الفوتر",
  company: "معلومات الشركة",
}

export default async function WebsiteContentPage() {
  await connectDB()
  const all = await contentRepository.list()
  const map = new Map(all.map((c) => [c.section, c]))

  const editableSections = ["hero", "company"]
  const editable = editableSections
    .map((s) => ({ section: s, doc: map.get(s) }))
    .filter((x) => x.doc)

  return (
    <div className="space-y-6">
      <PageHeader title="محتوى الموقع" description="إدارة المحتوى الظاهر للعملاء." />

      {editable.length === 0 ? (
        <EmptyState
          title="لا يوجد محتوى"
          description="شغّل أمر التهيئة لإضافة محتوى الموقع الافتراضي."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {editable.map(({ section, doc }) => (
            <div
              key={section}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
            >
              <ContentEditor
                section={section}
                title={SECTION_TITLES[section] ?? section}
                data={doc!.data as Record<string, unknown>}
              />
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-[#1E293B]">أقسام مُدارة من قاعدة البيانات</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SECTION_TITLES).map(([key, label]) => (
            <li
              key={key}
              className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#475569]"
            >
              {label}
              {map.has(key) ? (
                <span className="ms-2 text-[#16A34A]">●</span>
              ) : (
                <span className="ms-2 text-[#94A3B8]">○</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
