import mongoose, { Schema, type Model } from "mongoose"

export interface IAddress {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  fullName: string
  phone: string
  governorate: string
  city: string
  street: string
  postalCode?: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

const addressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    governorate: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Address: Model<IAddress> =
  mongoose.models.Address ?? mongoose.model<IAddress>("Address", addressSchema)
