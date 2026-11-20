import { NextResponse } from "next/server"

export function ok<T>(data: T, message = "Request completed successfully.", meta?: unknown) {
  return NextResponse.json({ success: true, message, data, meta }, { status: 200 })
}

export function created<T>(data: T, message = "Resource created.") {
  return NextResponse.json({ success: true, message, data }, { status: 201 })
}

export function noContent() {
  return new NextResponse(null, { status: 204 })
}

export function badRequest(errors: unknown, message = "Validation failed.") {
  return NextResponse.json({ success: false, message, errors }, { status: 400 })
}

export function unauthorized(message = "Unauthorized.") {
  return NextResponse.json({ success: false, message, errors: [] }, { status: 401 })
}

export function forbidden(message = "Forbidden.") {
  return NextResponse.json({ success: false, message, errors: [] }, { status: 403 })
}

export function notFound(message = "Resource not found.") {
  return NextResponse.json({ success: false, message, errors: [] }, { status: 404 })
}

export function tooManyRequests(message = "Too many requests.") {
  return NextResponse.json({ success: false, message, errors: [] }, { status: 429 })
}

export function serverError(message = "Internal server error.") {
  return NextResponse.json({ success: false, message, errors: [] }, { status: 500 })
}
