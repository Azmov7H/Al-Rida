import { connectDB } from "@/lib/db"
import { Product, type IProduct } from "@/models/product"

export const productRepository = {
  async findById(id: string): Promise<IProduct | null> {
    await connectDB()
    return Product.findById(id).lean()
  },

  async findBySlug(slug: string): Promise<IProduct | null> {
    await connectDB()
    return Product.findOne({ slug }).lean()
  },

  async list(query: Record<string, unknown> = {}, page = 1, limit = 24) {
    await connectDB()
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ])
    return { items, total, page, limit }
  },

  async create(data: Partial<IProduct>): Promise<IProduct> {
    await connectDB()
    return Product.create(data)
  },

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    await connectDB()
    return Product.findByIdAndUpdate(id, data, { new: true }).lean()
  },

  async decrementStock(id: string, quantity: number): Promise<void> {
    await connectDB()
    await Product.findByIdAndUpdate(id, { $inc: { stock: -quantity } })
  },
}
