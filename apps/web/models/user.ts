import mongoose, { Schema, type Model } from "mongoose"
import type { Role } from "@/constants/roles"

export interface IUser {
  _id: mongoose.Types.ObjectId
  email: string
  name: string
  passwordHash: string
  role: Role
  avatar?: string
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
  },
  { timestamps: true },
)

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", userSchema)
