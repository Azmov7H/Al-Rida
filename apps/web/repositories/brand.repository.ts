import { connectDB } from "@/lib/db"
import { Brand, type IBrand } from "@/models/brand"

export const brandRepository = {
  async list(): Promise<IBrand[]> {
    await connectDB()
    return Brand.find().sort({ name: 1 }).lean()
  },
  async create(data: Partial<IBrand>): Promise<IBrand> {
    await connectDB()
    return Brand.create(data)
  },
  async update(id: string, data: Partial<IBrand>): Promise<IBrand | null> {
    await connectDB()
    return Brand.findByIdAndUpdate(id, data, { new: true }).lean()
  },
  async remove(id: string): Promise<void> {
    await connectDB()
    await Brand.findByIdAndDelete(id)
  },
}
