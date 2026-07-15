import mongoose, { Schema, type Model } from "mongoose"

export interface ICoupon {
  _id: mongoose.Types.ObjectId
  code: string
  type: "percentage" | "fixed"
  value: number
  minSubtotal?: number
  maxUses?: number
  usedCount: number
  expiresAt?: Date
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    minSubtotal: { type: Number, min: 0 },
    maxUses: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon ?? mongoose.model<ICoupon>("Coupon", couponSchema)
