import mongoose, { Schema, type Model } from "mongoose"

export interface ICartItem {
  product: mongoose.Types.ObjectId
  quantity: number
}

export interface ICart {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  items: ICartItem[]
  updatedAt: Date
}

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true },
)

export const Cart: Model<ICart> =
  mongoose.models.Cart ?? mongoose.model<ICart>("Cart", cartSchema)
