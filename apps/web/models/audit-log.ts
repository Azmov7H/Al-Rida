import mongoose, { Schema, type Model } from "mongoose"

export type AuditAction =
  | "auth.login.success"
  | "auth.login.failure"
  | "auth.logout"
  | "auth.register"
  | "user.role.changed"
  | "product.created"
  | "product.updated"
  | "category.created"
  | "brand.created"
  | "coupon.created"
  | "order.placed"
  | "content.updated"
  | "company.update"
  | "company.create"
  | "company.address_update"
  | "link.create"
  | "link.update"
  | "link.delete"
  | "link.toggle_enabled"
  | "link.reorder"
  | "testimonial.create"
  | "testimonial.update"
  | "testimonial.delete"
  | "testimonial.publish"
  | "testimonial.unpublish"
  | "testimonial.verify"
  | "testimonial.unverify"
  | "fonts.update"
  | "address.update"
  | "csrf_failure"
  | "rate_limit_exceeded"
  | "auth_forbidden"

export interface IAuditLog {
  _id: mongoose.Types.ObjectId
  actorId?: string
  actorRole?: string
  actorEmail?: string
  action: AuditAction
  target?: string
  targetId?: string
  ip?: string
  userAgent?: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: String },
    actorRole: { type: String },
    actorEmail: { type: String },
    action: { type: String, required: true, index: true },
    target: { type: String },
    targetId: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

auditLogSchema.index({ action: 1, createdAt: -1 })

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ??
  mongoose.model<IAuditLog>("AuditLog", auditLogSchema)
