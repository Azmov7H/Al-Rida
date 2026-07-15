import mongoose, { Schema, type Model } from "mongoose"
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/types"

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  name: string
  sku: string
  price: number
  quantity: number
  total: number
}

export interface IOrderTimelineEntry {
  timestamp: Date
  status: OrderStatus
  note?: string
  actor: "customer" | "admin" | "system"
}

export interface IOrder {
  _id: mongoose.Types.ObjectId
  orderNumber: string
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  subtotal: number
  discount: number
  shippingFee: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  shippingAddress: mongoose.Types.ObjectId
  billingAddress?: mongoose.Types.ObjectId
  coupon?: mongoose.Types.ObjectId
  notes?: string
  timeline: IOrderTimelineEntry[]
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const orderTimelineSchema = new Schema<IOrderTimelineEntry>(
  {
    timestamp: { type: Date, default: Date.now },
    status: { type: String, required: true },
    note: { type: String },
    actor: { type: String, enum: ["customer", "admin", "system"], default: "system" },
  },
  { _id: false },
)

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
        "refunded",
        "returned",
      ],
      default: "pending",
    },
    paymentMethod: { type: String, enum: ["cod", "paymob", "stripe"], required: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "partially_paid", "refunded", "failed"],
      default: "unpaid",
    },
    shippingAddress: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    billingAddress: { type: Schema.Types.ObjectId, ref: "Address" },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    notes: { type: String },
    timeline: { type: [orderTimelineSchema], default: [] },
  },
  { timestamps: true },
)

export const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", orderSchema)
