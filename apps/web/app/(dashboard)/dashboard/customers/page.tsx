import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Badge } from "@/components/dashboard/shared/badge"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { connectDB } from "@/lib/db"
import { userRepository } from "@/repositories/user.repository"
import type { IUser } from "@/models/user"

export const dynamic = "force-dynamic"

const ROLE_TONE: Record<string, "gray" | "blue" | "orange"> = {
  customer: "gray",
  manager: "orange",
  admin: "blue",
}
const ROLE_LABEL: Record<string, string> = {
  customer: "عميل",
  manager: "مشرف",
  admin: "مدير",
}

async function load() {
  try {
    await connectDB()
    return await userRepository.list(1, 50)
  } catch {
    return [] as IUser[]
  }
}

export default async function CustomersPage() {
  const customers = await load()

  return (
    <div className="space-y-6">
      <PageHeader title="العملاء" description="قائمة عملاء المتجر وأدوارهم." />

      {customers.length === 0 ? (
        <EmptyState title="لا يوجد عملاء" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-right text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B]">
              <tr>
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">البريد الإلكتروني</th>
                <th className="px-4 py-3 font-medium">الدور</th>
                <th className="px-4 py-3 font-medium">انضم في</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {customers.map((c) => (
                <tr key={c._id?.toString()} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-medium text-[#1E293B]">{c.name}</td>
                  <td className="px-4 py-3 text-[#64748B]">{c.email}</td>
                  <td className="px-4 py-3">
                    <Badge tone={ROLE_TONE[c.role] ?? "gray"}>
                      {ROLE_LABEL[c.role] ?? c.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">
                    {new Date(c.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
