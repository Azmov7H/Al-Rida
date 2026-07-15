import mongoose, { Schema, type Model } from "mongoose"

export interface IBrand {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  logo?: string
  createdAt: Date
  updatedAt: Date
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String },
  },
  { timestamps: true },
)

export const Brand: Model<IBrand> =
  mongoose.models.Brand ?? mongoose.model<IBrand>("Brand", brandSchema)
