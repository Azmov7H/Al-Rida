import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { isNextControlFlowError } from "@/lib/auth/redirect"

/**
 * Standardized app errors — surfaced by API routes/Server Actions with
 * proper HTTP statuses.
 */
export class AppError extends Error {
  readonly status: number
  readonly code?: string
  readonly issues?: Array<{ path: (string | number)[] | string; message: string }>

  constructor(options: {
    status: number
    code?: string
    message?: string
    issues?: Array<{ path: (string | number)[] | string; message: string }>
  }) {
    super(options.message)
    this.name = "AppError"
    this.status = options.status
    this.code = options.code
    this.issues = options.issues
  }
}

export function badRequest(message = "Bad Request"): AppError {
  return new AppError({ status: 400, message })
}

export function validationError(
  issues: Array<{ path: (string | number)[] | string; message: string }>,
): AppError {
  return new AppError({ status: 400, code: "VALIDATION_ERROR", message: issues[0]?.message ?? "Invalid input", issues })
}

export function unauthorized(): AppError {
  return new AppError({ status: 401, code: "UNAUTHORIZED", message: "Authentication required" })
}

export function forbidden(): AppError {
  return new AppError({ status: 403, code: "FORBIDDEN", message: "Access denied" })
}

export function notFound(message = "Not found"): AppError {
  return new AppError({ status: 404, code: "NOT_FOUND", message })
}

export function conflict(message: string): AppError {
  return new AppError({ status: 409, code: "CONFLICT", message })
}

export function rateLimited(): AppError {
  return new AppError({ status: 429, code: "RATE_LIMITED", message: "Too many requests" })
}

export class ServiceError extends Error {
  readonly publicMessage = "An unexpected error occurred"
  constructor(message?: string) {
    super(message ?? "Service error")
    this.name = "ServiceError"
  }
}

// ---------------------------------------------------------------------------
// Legacy: Route Handler wrapper
// ---------------------------------------------------------------------------
type Handler = (request: Request) => Promise<NextResponse> | NextResponse

/**
 * Wraps an API Route Handler so unexpected errors return a 500 JSON instead
 * of leaking stack traces, while letting Next control-flow errors (redirect /
 * notFound) propagate.
 */
export function withErrorHandler(handler: Handler): Handler {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (err) {
      if (isNextControlFlowError(err)) throw err
      const path = new URL(request.url).pathname
      logger.error("api_handler_error", err, { path, method: request.method })
      return NextResponse.json(
        { success: false, message: "Internal server error.", errors: [] },
        { status: 500 },
      )
    }
  }
}
