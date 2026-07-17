import { PageHeader } from "@/components/dashboard/shared/page-header"

export default function RolesPage() {
  const roles = [
    {
      name: "مدير النظام",
      key: "admin",
      perms: ["إدارة المستخدمين", "كل الصلاحيات", "الإعدادات"],
    },
    {
      name: "مشرف",
      key: "manager",
      perms: ["إدارة المنتجات", "إدارة الطلبات", "إدارة المخزون", "التقارير"],
    },
    {
      name: "عميل",
      key: "customer",
      perms: ["تصفح المتجر", "إتمام الطلبات", "الملف الشخصي"],
    },
  ]
  return (
    <div className="space-y-6">
      <PageHeader title="الأدوار والصلاحيات" description="تحكم في صلاحيات الوصول لكل دور." />
      <div className="grid gap-4 lg:grid-cols-3">
        {roles.map((r) => (
          <div key={r.key} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-[#1E293B]">{r.name}</h2>
            <ul className="space-y-2">
              {r.perms.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-[#475569]">
                  <span className="size-1.5 rounded-full bg-[#0F3B73]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
