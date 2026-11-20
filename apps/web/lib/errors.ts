import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { isNextControlFlowError } from "@/lib/auth/redirect"

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
