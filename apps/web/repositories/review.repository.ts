import mongoose from "mongoose"
import { connectDB } from "@/lib/db"
import { Review, type IReview } from "@/models/review"

export const reviewRepository = {
  async list(page = 1, limit = 50): Promise<IReview[]> {
    await connectDB()
    return Review.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean()
  },

  async listByProduct(productId: string): Promise<IReview[]> {
    await connectDB()
    return Review.find({ product: productId }).sort({ createdAt: -1 }).lean()
  },
  async create(data: Record<string, unknown>): Promise<IReview> {
    await connectDB()
    const payload: Record<string, unknown> = { ...data }
    if (typeof payload.product === "string") {
      payload.product = new mongoose.Types.ObjectId(payload.product)
    }
    if (typeof payload.user === "string") {
      payload.user = new mongoose.Types.ObjectId(payload.user)
    }
    return Review.create(payload)
  },
  async update(id: string, userId: string, data: Partial<IReview>): Promise<IReview | null> {
    await connectDB()
    return Review.findOneAndUpdate({ _id: id, user: userId }, data, { new: true }).lean()
  },
  async remove(id: string, userId: string): Promise<void> {
    await connectDB()
    await Review.findOneAndDelete({ _id: id, user: userId })
  },
}
