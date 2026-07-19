import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LogOut, Bell } from "lucide-react"
import { getSession } from "@/lib/auth/session"
import { hasRole } from "@/constants/roles"
import { DashboardSidebar } from "@/components/dashboard/layout/sidebar"
import { siteConfig } from "@/config/site"
import { logoutAction } from "@/app/(dashboard)/dashboard/actions"
import { connectDB } from "@/lib/db"
import { orderRepository } from "@/repositories/order.repository"

export const metadata: Metadata = {
  title: {
    default: `لوحة التحكم · ${siteConfig.name}`,
    template: `%s · ${siteConfig.name}`,
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session || !hasRole(session.role, "manager")) {
    redirect("/login")
  }

  let pendingOrders = 0
  try {
    await connectDB()
    const { total } = await orderRepository.listForAdmin(1, 1, { status: "pending" })
    pendingOrders = total
  } catch {
    pendingOrders = 0
  }

  const year = new Date().getFullYear()

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <DashboardSidebar user={session} />
      <div className="flex min-w-0 flex-1 flex-col lg:mr-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white/80 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#64748B]">
              مرحباً، <span className="font-semibold text-[#0F3B73]">{session.name}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/orders"
              className="relative inline-flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9]"
              aria-label="الطلبات المعلقة"
            >
              <Bell className="size-5" />
              {pendingOrders > 0 ? (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white">
                  {pendingOrders > 9 ? "9+" : pendingOrders}
                </span>
              ) : null}
            </Link>
            <span className="hidden rounded-full bg-[#0F3B73]/10 px-3 py-1 text-xs font-medium text-[#0F3B73] sm:inline-block">
              {session.role === "admin" ? "مدير النظام" : "مشرف"}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9]"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="size-5" />
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
        <footer className="border-t border-[#E2E8F0] bg-white px-5 py-4 text-center text-xs text-[#94A3B8] lg:px-8">
          {siteConfig.name} · لوحة التحكم · {session.name} ({session.email}) · © {year}
        </footer>
      </div>
    </div>
  )
}
