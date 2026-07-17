"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SessionPayload } from "@/lib/auth/session"

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

export function DashboardSidebar({ user }: { user: SessionPayload }) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-[#E2E8F0] px-5">
        <span className="text-xl font-bold text-[#0F3B73]">الرضا</span>
        <span className="text-xs text-[#64748B]">لوحة التحكم</span>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              {group.section}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-[#0F3B73] text-white"
                          : "text-[#475569] hover:bg-[#F1F5F9]",
                      )}
                    >
                      <Icon className="size-5 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-[#E2E8F0] px-5 py-4">
        <p className="truncate text-sm font-medium text-[#1E293B]">{user.name}</p>
        <p className="truncate text-xs text-[#94A3B8]">{user.email}</p>
      </div>
    </div>
  )

  return (
    <>
      <button
        aria-label="القائمة"
        className="fixed bottom-4 left-4 z-50 inline-flex size-12 items-center justify-center rounded-full bg-[#0F3B73] text-white shadow-lg lg:hidden"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      <aside className="fixed inset-y-0 right-0 z-40 hidden w-72 border-l border-[#E2E8F0] bg-white lg:block">
        {content}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 w-72 bg-white shadow-xl">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  )
}
