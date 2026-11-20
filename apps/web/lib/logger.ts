type LogLevel = "debug" | "info" | "warn" | "error"

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const REDACT_KEYS = new Set([
  "password",
  "passwordhash",
  "token",
  "authorization",
  "cookie",
  "session",
  "csrftoken",
  "secret",
])

function redact(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || typeof value !== "object") return value
  if (seen.has(value as object)) return "[circular]"
  seen.add(value as object)

  if (Array.isArray(value)) {
    return value.map((v) => redact(v, seen))
  }

  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (REDACT_KEYS.has(key.toLowerCase())) {
      out[key] = "[redacted]"
    } else if (val && typeof val === "object") {
      out[key] = redact(val, seen)
    } else {
      out[key] = val
    }
  }
  return out
}

function currentLevel(): LogLevel {
  const raw = process.env.LOG_LEVEL
  if (raw && raw in LEVEL_ORDER) return raw as LogLevel
  return process.env.NODE_ENV === "production" ? "info" : "debug"
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void
  info(message: string, context?: Record<string, unknown>): void
  warn(message: string, context?: Record<string, unknown>): void
  error(message: string, error?: unknown, context?: Record<string, unknown>): void
  child(context: Record<string, unknown>): Logger
}

class ConsoleLogger implements Logger {
  constructor(
    private readonly base: Record<string, unknown>,
    private readonly level: LogLevel,
  ) {}

  private emit(level: LogLevel, message: string, context?: Record<string, unknown>) {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.level]) return
    const timestamp = new Date().toISOString()
    const payload = {
      level,
      timestamp,
      message,
      ...this.base,
      ...(context ? (redact(context) as Record<string, unknown>) : {}),
    }
    if (process.env.NODE_ENV === "production") {
      process.stdout.write(`${JSON.stringify(payload)}\n`)
    } else if (level === "error") {
      console.error(payload)
    } else if (level === "warn") {
      console.warn(payload)
    } else {
      console.log(payload)
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.emit("debug", message, context)
  }
  info(message: string, context?: Record<string, unknown>) {
    this.emit("info", message, context)
  }
  warn(message: string, context?: Record<string, unknown>) {
    this.emit("warn", message, context)
  }
  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    const errorContext =
      error instanceof Error
        ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
        : { error: redact(error) }
    this.emit("error", message, { ...errorContext, ...context })
  }
  child(context: Record<string, unknown>): Logger {
    return new ConsoleLogger({ ...this.base, ...context }, this.level)
  }
}

export const logger: Logger = new ConsoleLogger({}, currentLevel())
