import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/dashboard/shared/page-header"
import { Badge } from "@/components/dashboard/shared/badge"
import { Button } from "@/components/ui/button"
import { connectDB } from "@/lib/db"
import { userRepository } from "@/repositories/user.repository"
import type { IUser } from "@/models/user"

export const dynamic = "force-dynamic"

async function load(id: string) {
  try {
    await connectDB()
    return await userRepository.findById(id)
  } catch {
    return null
  }
}

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = (await load(id)) as IUser | null
  if (!user) notFound()

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/users"
        className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F3B73]"
      >
        <ArrowLeft className="size-4" /> العودة للمستخدمين
      </Link>
      <PageHeader title="تحرير المستخدم" description={user.email} />
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <p className="text-lg font-semibold text-[#1E293B]">{user.name}</p>
          <Badge tone={user.role === "admin" ? "blue" : user.role === "manager" ? "orange" : "gray"}>
            {user.role}
          </Badge>
        </div>
        <form className="grid gap-3 sm:grid-cols-2">
          <input name="name" defaultValue={user.name} className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
          <input name="email" defaultValue={user.email} type="email" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
          <select name="role" defaultValue={user.role} className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]">
            <option value="customer">عميل</option>
            <option value="manager">مشرف</option>
            <option value="admin">مدير</option>
          </select>
          <Button type="submit" size="sm">
            حفظ
          </Button>
        </form>
      </div>
    </div>
  )
}
