import mongoose, { Schema, type Model } from "mongoose"

export interface IContent {
  _id: mongoose.Types.ObjectId
  section: string
  title?: string
  data: Record<string, unknown>
  updatedAt: Date
}

const contentSchema = new Schema<IContent>(
  {
    section: { type: String, required: true, unique: true, index: true },
    title: { type: String },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
)

export const Content: Model<IContent> =
  mongoose.models.Content ?? mongoose.model<IContent>("Content", contentSchema)
