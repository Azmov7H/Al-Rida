import { connectDB } from "@/lib/db"
import { User, type IUser } from "@/models/user"

export const userRepository = {
  async findByEmail(email: string): Promise<IUser | null> {
    await connectDB()
    return User.findOne({ email }).lean()
  },

  async findById(id: string): Promise<IUser | null> {
    await connectDB()
    return User.findById(id).lean()
  },

  async create(data: Partial<IUser>): Promise<IUser> {
    await connectDB()
    return User.create(data)
  },

  async findOrCreateGuest(
    email: string,
    name: string,
  ): Promise<IUser> {
    await connectDB()
    const existing = await User.findOne({ email }).lean()
    if (existing) return existing
    return User.create({ email, name, passwordHash: "", role: "customer" })
  },

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await connectDB()
    return User.findByIdAndUpdate(id, data, { new: true }).lean()
  },

  async remove(id: string): Promise<void> {
    await connectDB()
    await User.findByIdAndDelete(id)
  },
}
