import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import {
  ShoppingBag,
  UserPlus,
  Package,
  Ticket,
  ShieldCheck,
  Activity as ActivityIcon,
} from "lucide-react"
import { connectDB } from "@/lib/db"
import { getActivityFeed, ACTIVITY_ICONS } from "@/lib/activity"

export const dynamic = "force-dynamic"

const ICONS: Record<string, typeof ActivityIcon> = {
  "order.created": ShoppingBag,
  "user.registered": UserPlus,
  "product.created": Package,
  "product.updated": Package,
  "coupon.created": Ticket,
  "role.changed": ShieldCheck,
  login: ActivityIcon,
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "الآن"
  if (mins < 60) return `قبل ${mins} دقيقة`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `قبل ${hrs} ساعة`
  const days = Math.floor(hrs / 24)
  return `قبل ${days} يوم`
}

export default async function ActivityLogPage() {
  await connectDB()
  const items = await getActivityFeed(50)

  return (
    <div className="space-y-6">
      <PageHeader title="سجل النشاطات" description="تتبع عمليات المستخدمين والتغييرات." />

      {items.length === 0 ? (
        <EmptyState
          title="لا توجد سجلات بعد"
          description="سيتم تسجيل دخول المستخدمين والتغييرات على المنتجات والطلبات هنا."
        />
      ) : (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-sm">
          <ul className="divide-y divide-[#F1F5F9]">
            {items.map((item) => {
              const Icon = ICONS[item.action] ?? ActivityIcon
              return (
                <li key={item._id} className="flex items-start gap-3 px-3 py-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0F3B73]/10 text-[#0F3B73]">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#1E293B]">{item.message}</p>
                    <p className="mt-0.5 text-xs text-[#94A3B8]">
                      {ACTIVITY_ICONS[item.action] ?? item.action} · {item.actor} ·{" "}
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
