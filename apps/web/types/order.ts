import type { Money, OrderStatus, PaymentMethod, PaymentStatus } from "@/types"

export interface OrderItem {
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  total: number
}

export interface OrderTimelineEntry {
  timestamp: Date
  status: OrderStatus
  note?: string
  actor: "customer" | "admin" | "system"
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  subtotal: Money
  discount: Money
  shippingFee: Money
  tax: Money
  total: Money
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  shippingAddressId: string
  billingAddressId?: string
  couponId?: string
  notes?: string
  timeline: OrderTimelineEntry[]
}
