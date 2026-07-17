import mongoose, { Schema, type Model } from "mongoose"

export interface IReview {
  _id: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  rating: number
  title?: string
  comment: string
  createdAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
  },
  { timestamps: true },
)

export const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>("Review", reviewSchema)
