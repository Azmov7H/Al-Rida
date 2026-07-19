import { connectDB } from "@/lib/db"
import { Coupon, type ICoupon } from "@/models/coupon"

export const couponRepository = {
  async list(): Promise<ICoupon[]> {
    await connectDB()
    return Coupon.find().sort({ createdAt: -1 }).lean()
  },
  async create(data: Record<string, unknown>): Promise<ICoupon> {
    await connectDB()
    return Coupon.create(data)
  },
  async update(id: string, data: Record<string, unknown>): Promise<ICoupon | null> {
    await connectDB()
    return Coupon.findByIdAndUpdate(id, data, { new: true }).lean()
  },
  async remove(id: string): Promise<void> {
    await connectDB()
    await Coupon.findByIdAndDelete(id)
  },
}
