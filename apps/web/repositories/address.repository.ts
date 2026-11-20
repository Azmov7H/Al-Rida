import { connectDB } from "@/lib/db"
import { Address, type IAddress } from "@/models/address"

export const addressRepository = {
  async listByUser(userId: string): Promise<IAddress[]> {
    await connectDB()
    return Address.find({ user: userId }).lean()
  },

  async create(data: Partial<IAddress>): Promise<IAddress> {
    await connectDB()
    return Address.create(data)
  },

  async update(id: string, userId: string, data: Partial<IAddress>): Promise<IAddress | null> {
    await connectDB()
    return Address.findOneAndUpdate({ _id: id, user: userId }, data, {
      new: true,
    }).lean()
  },

  async remove(id: string, userId: string): Promise<void> {
    await connectDB()
    await Address.findOneAndDelete({ _id: id, user: userId })
  },
}
