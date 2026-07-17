import mongoose from "mongoose"
import { connectDB } from "@/lib/db"
import { Wishlist } from "@/models/wishlist"

export const wishlistRepository = {
  async getByUser(userId: string) {
    await connectDB()
    return Wishlist.findOne({ user: userId }).populate("products").lean()
  },

  async toggle(userId: string, productId: string) {
    await connectDB()
    const list = await Wishlist.findOne({ user: userId })
    const pid = new mongoose.Types.ObjectId(productId)
    if (!list) {
      return Wishlist.create({ user: userId, products: [pid] })
    }
    const exists = list.products.some((p) => p.toString() === productId)
    if (exists) {
      list.products = list.products.filter((p) => p.toString() !== productId)
    } else {
      list.products.push(pid)
    }
    await list.save()
    return list.populate("products")
  },

  async remove(userId: string, productId: string) {
    await connectDB()
    const list = await Wishlist.findOne({ user: userId })
    if (list) {
      list.products = list.products.filter((p) => p.toString() !== productId)
      await list.save()
    }
    return list
  },
}
