import { auditLogRepository, type AuditEntry } from "@/repositories/audit-log.repository"
import { logger } from "@/lib/logger"

/**
 * Writes an immutable security audit record. Never throws — audit logging
 * must not break the primary action. Failures are logged at error level.
 */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await auditLogRepository.record(entry)
  } catch (err) {
    logger.error("audit_log_failed", err, { action: entry.action })
  }
}

export function clientMeta(request?: Request): { ip?: string; userAgent?: string } {
  if (!request) return {}
  const fwd = request.headers.get("x-forwarded-for")
  return {
    ip: fwd?.split(",")[0]?.trim() || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  }
}
