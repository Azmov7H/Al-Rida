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
}
