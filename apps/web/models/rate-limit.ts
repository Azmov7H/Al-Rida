import mongoose, { Schema, type Model } from "mongoose"

export interface IRateLimitBucket {
  _id: mongoose.Types.ObjectId
  key: string
  count: number
  resetAt: number
}

const rateLimitBucketSchema = new Schema<IRateLimitBucket>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    resetAt: { type: Number, required: true },
  },
  { timestamps: true },
)

rateLimitBucketSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 })

export const RateLimitBucket: Model<IRateLimitBucket> =
  mongoose.models.RateLimitBucket ??
  mongoose.model<IRateLimitBucket>("RateLimitBucket", rateLimitBucketSchema)
