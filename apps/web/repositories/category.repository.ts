import mongoose from "mongoose"
import { connectDB } from "@/lib/db"
import { Category, type ICategory } from "@/models/category"

export const categoryRepository = {
  async list(): Promise<ICategory[]> {
    await connectDB()
    return Category.find().sort({ name: 1 }).lean()
  },
  async create(data: Record<string, unknown>): Promise<ICategory> {
    await connectDB()
    const payload: Record<string, unknown> = { ...data }
    if (typeof payload.parent === "string") {
      payload.parent = new mongoose.Types.ObjectId(payload.parent)
    }
    return Category.create(payload)
  },
  async update(id: string, data: Record<string, unknown>): Promise<ICategory | null> {
    await connectDB()
    const payload: Record<string, unknown> = { ...data }
    if (typeof payload.parent === "string") {
      payload.parent = new mongoose.Types.ObjectId(payload.parent)
    }
    return Category.findByIdAndUpdate(id, payload, { new: true }).lean()
  },
  async remove(id: string): Promise<void> {
    await connectDB()
    await Category.findByIdAndDelete(id)
  },
}
