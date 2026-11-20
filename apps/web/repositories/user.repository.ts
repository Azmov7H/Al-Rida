import { connectDB } from "@/lib/db"
import { User, type IUser } from "@/models/user"

const LOCKOUT_THRESHOLD = 5
const LOCKOUT_DURATION_MS = 30 * 60 * 1000

export const userRepository = {
  async findByEmail(email: string): Promise<IUser | null> {
    await connectDB()
    return User.findOne({ email }).lean()
  },

  async list(page = 1, limit = 50): Promise<IUser[]> {
    await connectDB()
    return User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean()
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

  /** Record successful login: update lastLoginAt, reset failedAttempts. */
  async markLoginSuccess(id: string): Promise<void> {
    await connectDB()
    await User.updateOne({ _id: id }, { $set: { lastLoginAt: new Date(), failedAttempts: 0 } })
  },

  /** Record failed login attempt. After LOCKOUT_THRESHOLD failures → lockoutUntil = +LOCKOUT_DURATION. */
  async markLoginFailure(id: string): Promise<void> {
    await connectDB()
    const user = await User.findById(id)
    if (!user) return
    const attempts = (user.failedAttempts ?? 0) + 1
    const update: Partial<IUser> = { failedAttempts: attempts }
    if (attempts >= LOCKOUT_THRESHOLD) {
      update.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MS)
    }
    await User.updateOne({ _id: id }, { $set: update })
  },
}
