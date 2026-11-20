import mongoose, { Schema, type Model } from "mongoose"
import type { Role } from "@/constants/roles"

export interface IUser {
  _id: mongoose.Types.ObjectId
  email: string
  name: string
  passwordHash: string
  role: Role
  avatar?: string
  lastLoginAt?: Date
  failedAttempts: number
  lockoutUntil?: Date
  passwordChangedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "manager", "admin"], default: "customer" },
    avatar: { type: String },
    lastLoginAt: { type: Date },
    failedAttempts: { type: Number, default: 0 },
    lockoutUntil: { type: Date },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true },
)

userSchema.index({ role: 1 }, { name: "User_role" })

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", userSchema)
