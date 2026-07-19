import { connectDB } from "@/lib/db"
import { activityRepository } from "@/repositories/activity.repository"
import { orderRepository } from "@/repositories/order.repository"
import { userRepository } from "@/repositories/user.repository"
import { productRepository } from "@/repositories/product.repository"
import { couponRepository } from "@/repositories/coupon.repository"
import type { IActivity } from "@/models/activity"

export interface ActivityItem {
  _id: string
  actor: string
  actorRole: string
  action: string
  entity?: string
  entityId?: string
  message: string
  createdAt: Date
}

export async function logActivity(entry: {
  actor: string
  actorRole?: string
  action: IActivity["action"]
  entity?: string
  entityId?: string
  message: string
}): Promise<void> {
  try {
    await activityRepository.log(entry)
  } catch {
    // Activity logging must never break the primary action.
  }
}

/**
 * Returns the activity feed. If the Activity collection has entries we use
 * them directly; otherwise we derive a truthful feed from real, timestamped
 * events (orders, registrations, product/coupon creation) so the page is
 * never empty before events start being logged.
 */
export async function getActivityFeed(limit = 50): Promise<ActivityItem[]> {
  await connectDB()
  const logged = await activityRepository.list(limit)
  if (logged.length > 0) {
    return logged.map(toItem)
  }

  const [orders, users, products, coupons] = await Promise.all([
    orderRepository.listForAdmin(1, limit),
    userRepository.list(1, limit),
    productRepository.list({}, 1, limit, { createdAt: -1 }),
    couponRepository.list(),
  ])

  const derived: ActivityItem[] = [
    ...orders.items.map((o) => ({
      _id: `order-${o._id?.toString()}`,
      actor: "عميل",
      actorRole: "customer",
      action: "order.created",
      entity: "order",
      entityId: o._id?.toString(),
      message: `طلب جديد رقم ${o.orderNumber} بقيمة ${o.total}`,
      createdAt: new Date(o.createdAt),
    })),
    ...users.map((u) => ({
      _id: `user-${u._id?.toString()}`,
      actor: u.name,
      actorRole: u.role,
      action: "user.registered",
      entity: "user",
      entityId: u._id?.toString(),
      message: `انضم مستخدم جديد: ${u.name} (${u.email})`,
      createdAt: new Date(u.createdAt),
    })),
    ...products.items.map((p) => ({
      _id: `product-${p._id?.toString()}`,
      actor: "النظام",
      actorRole: "system",
      action: "product.created",
      entity: "product",
      entityId: p._id?.toString(),
      message: `تمت إضافة منتج: ${p.name}`,
      createdAt: new Date(p.createdAt),
    })),
    ...coupons.map((c) => ({
      _id: `coupon-${c._id?.toString()}`,
      actor: "النظام",
      actorRole: "system",
      action: "coupon.created",
      entity: "coupon",
      entityId: c._id?.toString(),
      message: `تم إنشاء كوبون: ${c.code}`,
      createdAt: new Date(c.createdAt),
    })),
  ]

  return derived.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
}

function toItem(a: IActivity): ActivityItem {
  return {
    _id: a._id.toString(),
    actor: a.actor,
    actorRole: a.actorRole,
    action: a.action,
    entity: a.entity,
    entityId: a.entityId,
    message: a.message,
    createdAt: new Date(a.createdAt),
  }
}

export const ACTIVITY_ICONS: Record<string, string> = {
  "order.created": "طلب",
  "user.registered": "مستخدم",
  "product.created": "منتج",
  "product.updated": "منتج",
  "coupon.created": "كوبون",
  "role.changed": "دور",
  login: "دخول",
}
