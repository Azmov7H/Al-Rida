import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await getSession()
  return (
    <div className="space-y-6">
      <PageHeader title="الملف الشخصي" description="بيانات حسابك الشخصية." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">المعلومات الشخصية</h2>
          <div className="grid gap-3">
            <input defaultValue={session?.name} placeholder="الاسم" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
            <input defaultValue={session?.email} type="email" placeholder="البريد" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
            <Button size="sm">حفظ</Button>
          </div>
        </section>
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">تغيير كلمة المرور</h2>
          <div className="grid gap-3">
            <input type="password" placeholder="الحالية" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
            <input type="password" placeholder="الجديدة" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
            <Button size="sm" variant="outline">تحديث</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
