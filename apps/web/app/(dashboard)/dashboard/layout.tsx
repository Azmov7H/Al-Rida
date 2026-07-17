import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Boxes,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  Megaphone,
  Image as ImageIcon,
  FileBarChart,
  BarChart3,
  UserCog,
  ShieldCheck,
  Activity,
  FileText,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react"
import { getSession } from "@/lib/auth/session"
import { hasRole } from "@/constants/roles"
import { DashboardSidebar } from "@/components/dashboard/layout/sidebar"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: {
    default: `لوحة التحكم · ${siteConfig.name}`,
    template: `%s · ${siteConfig.name}`,
  },
}

const NAV = [
  { section: "عام", items: [{ label: "الرئيسية", href: "/dashboard", icon: LayoutDashboard }] },
  {
    section: "الكتالوج",
    items: [
      { label: "المنتجات", href: "/dashboard/products", icon: Package },
      { label: "الفئات", href: "/dashboard/categories", icon: FolderTree },
      { label: "العلامات التجارية", href: "/dashboard/brands", icon: Tag },
      { label: "المخزون", href: "/dashboard/inventory", icon: Boxes },
    ],
  },
  {
    section: "العمليات",
    items: [
      { label: "الطلبات", href: "/dashboard/orders", icon: ShoppingCart },
      { label: "العملاء", href: "/dashboard/customers", icon: Users },
      { label: "التقييمات", href: "/dashboard/reviews", icon: Star },
      { label: "رسائل التواصل", href: "/dashboard/contact", icon: MessageSquare },
    ],
  },
  {
    section: "النمو",
    items: [
      { label: "التسويق", href: "/dashboard/marketing", icon: Megaphone },
      { label: "مكتبة الوسائط", href: "/dashboard/media", icon: ImageIcon },
      { label: "التقارير", href: "/dashboard/reports", icon: FileBarChart },
      { label: "التحليلات", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    section: "النظام",
    items: [
      { label: "المستخدمون", href: "/dashboard/users", icon: UserCog },
      { label: "الأدوار والصلاحيات", href: "/dashboard/roles", icon: ShieldCheck },
      { label: "سجل النشاطات", href: "/dashboard/activity", icon: Activity },
      { label: "محتوى الموقع", href: "/dashboard/content", icon: FileText },
      { label: "الإعدادات", href: "/dashboard/settings", icon: Settings },
      { label: "الملف الشخصي", href: "/dashboard/profile", icon: UserCircle },
    ],
  },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session || !hasRole(session.role, "manager")) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <DashboardSidebar nav={NAV} user={session} />
      <div className="flex min-w-0 flex-1 flex-col lg:mr-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white/80 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#64748B]">
              مرحباً، <span className="font-semibold text-[#0F3B73]">{session.name}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-[#0F3B73]/10 px-3 py-1 text-xs font-medium text-[#0F3B73] sm:inline-block">
              {session.role === "admin" ? "مدير النظام" : "مشرف"}
            </span>
            <Link
              href="/login"
              className="inline-flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9]"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="size-5" />
            </Link>
          </div>
        </header>
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
