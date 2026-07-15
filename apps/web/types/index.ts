import type { Role } from "@/constants/roles"

export type ProductStatus = "active" | "draft" | "out_of_stock" | "archived"

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded"
  | "returned"

export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "partially_paid"
  | "refunded"
  | "failed"

export type PaymentMethod = "cod" | "paymob" | "stripe"

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
}

export interface Seo {
  title: string
  description: string
  keywords: string[]
}

export interface Money {
  amount: number
  currency: string
}
