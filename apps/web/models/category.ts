import mongoose, { Schema, type Model } from "mongoose"

export interface ICategory {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  image?: string
  parent?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true },
)

export const Category: Model<ICategory> =
  mongoose.models.Category ?? mongoose.model<ICategory>("Category", categorySchema)
