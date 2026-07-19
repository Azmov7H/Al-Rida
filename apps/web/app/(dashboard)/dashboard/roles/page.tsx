import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Badge } from "@/components/dashboard/shared/badge"
import { RoleEditor } from "@/components/dashboard/roles/role-editor"
import { connectDB } from "@/lib/db"
import { userRepository } from "@/repositories/user.repository"
import { ROLES, type Role } from "@/constants/roles"
import { type IUser } from "@/models/user"

const ROLE_LABEL: Record<Role, string> = {
  customer: "عميل",
  manager: "مشرف",
  admin: "مدير",
}
const ROLE_TONE: Record<Role, "gray" | "orange" | "blue"> = {
  customer: "gray",
  manager: "orange",
  admin: "blue",
}

// Real permission surface derived from the actual guards in the codebase:
// manager gates all dashboard + API mutations; admin additionally gates
// destructive/settings routes. `customer` is storefront-only.
const PERMISSIONS: { label: string; required: Role }[] = [
  { label: "تصفح المتجر", required: "customer" },
  { label: "الملف الشخصي والطلبات", required: "customer" },
  { label: "إدارة المنتجات", required: "manager" },
  { label: "إدارة الفئات والعلامات", required: "manager" },
  { label: "إدارة الطلبات والمخزون", required: "manager" },
  { label: "التقارير والتحليلات", required: "manager" },
  { label: "الكوبونات والتسويق", required: "manager" },
  { label: "رفع الوسائط (Cloudinary)", required: "manager" },
  { label: "حذف الطلبات", required: "admin" },
  { label: "إعدادات النظام", required: "admin" },
]

function can(role: Role, required: Role): boolean {
  const order: Role[] = ["customer", "manager", "admin"]
  return order.indexOf(role) >= order.indexOf(required)
}

export const dynamic = "force-dynamic"

export default async function RolesPage() {
  await connectDB()
  const users = await userRepository.list(1, 200)

  const counts: Record<Role, number> = { customer: 0, manager: 0, admin: 0 }
  for (const u of users) {
    if (u.role in counts) counts[u.role as Role] += 1
  }

  return (
    <div className="space-y-6">
      <PageHeader title="الأدوار والصلاحيات" description="تحكم في صلاحيات الوصول لكل دور." />

      <div className="grid gap-4 lg:grid-cols-3">
        {ROLES.map((role) => (
          <div key={role} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1E293B]">{ROLE_LABEL[role]}</h2>
              <Badge tone={ROLE_TONE[role]}>{counts[role]} مستخدم</Badge>
            </div>
            <ul className="space-y-2">
              {PERMISSIONS.filter((p) => can(role, p.required)).map((p) => (
                <li key={p.label} className="flex items-center gap-2 text-sm text-[#475569]">
                  <span className="size-1.5 rounded-full bg-[#16A34A]" />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">تعيين أدوار المستخدمين</h2>
        {users.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">لا يوجد مستخدمون.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-right text-sm">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B]">
                <tr>
                  <th className="px-4 py-3 font-medium">الاسم</th>
                  <th className="px-4 py-3 font-medium">البريد</th>
                  <th className="px-4 py-3 font-medium">الدور الحالي</th>
                  <th className="px-4 py-3 font-medium">تغيير الدور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {users.map((u: IUser) => (
                  <tr key={u._id?.toString()} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-medium text-[#1E293B]">{u.name}</td>
                    <td className="px-4 py-3 text-[#64748B]">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge tone={ROLE_TONE[u.role]}>{ROLE_LABEL[u.role]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <RoleEditor userId={u._id!.toString()} currentRole={u.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
