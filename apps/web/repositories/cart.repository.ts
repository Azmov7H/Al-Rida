import mongoose from "mongoose"
import { connectDB } from "@/lib/db"
import { Cart, type ICart } from "@/models/cart"

export const cartRepository = {
  async getByUser(userId: string): Promise<ICart | null> {
    await connectDB()
    return Cart.findOne({ user: userId }).populate("items.product").lean()
  },

  async setItems(
    userId: string,
    items: { product: string; quantity: number }[],
  ): Promise<ICart | null> {
    await connectDB()
    return Cart.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        items: items.map((i) => ({
          product: new mongoose.Types.ObjectId(i.product),
          quantity: i.quantity,
        })),
      },
      { upsert: true, new: true },
    ).lean()
  },

  async addItem(userId: string, product: string, quantity: number): Promise<ICart | null> {
    await connectDB()
    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] })
    }
    const existing = cart.items.find((i) => i.product.toString() === product)
    if (existing) {
      existing.quantity += quantity
    } else {
      cart.items.push({ product: new mongoose.Types.ObjectId(product), quantity })
    }
    await cart.save()
    return Cart.findOne({ user: userId }).populate("items.product").lean()
  },

  async clear(userId: string): Promise<void> {
    await connectDB()
    await Cart.findOneAndUpdate({ user: userId }, { items: [] })
  },
}
