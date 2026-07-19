import mongoose, { Schema, type Model } from "mongoose"

export type ActivityAction =
  | "order.created"
  | "user.registered"
  | "product.created"
  | "product.updated"
  | "coupon.created"
  | "role.changed"
  | "login"

export interface IActivity {
  _id: mongoose.Types.ObjectId
  actor: string
  actorRole: string
  action: ActivityAction
  entity?: string
  entityId?: string
  message: string
  createdAt: Date
}

const activitySchema = new Schema<IActivity>(
  {
    actor: { type: String, required: true },
    actorRole: { type: String, default: "system" },
    action: { type: String, required: true, index: true } as unknown as ActivityAction,
    entity: { type: String },
    entityId: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true },
)

export const Activity: Model<IActivity> =
  mongoose.models.Activity ?? mongoose.model<IActivity>("Activity", activitySchema)
