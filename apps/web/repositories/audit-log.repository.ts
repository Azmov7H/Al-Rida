import { connectDB } from "@/lib/db"
import { AuditLog, type IAuditLog } from "@/models/audit-log"

export interface AuditEntry {
  actorId?: string
  actorRole?: string
  actorEmail?: string
  action: IAuditLog["action"]
  target?: string
  targetId?: string
  ip?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

export const auditLogRepository = {
  async record(entry: AuditEntry): Promise<void> {
    await connectDB()
    await AuditLog.create(entry)
  },

  async list(page = 1, limit = 50, filter: Partial<AuditEntry> = {}) {
    await connectDB()
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments(filter),
    ])
    return { items, total, page, limit }
  },
}
