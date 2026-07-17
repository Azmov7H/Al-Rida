import { NextResponse, type NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { hasRole, type Role } from "@/constants/roles"

const SECRET = process.env.JWT_SECRET ?? "change-me"

const PUBLIC_PATHS = [
  "/",
  "/shop",
  "/products",
  "/categories",
  "/brands",
  "/login",
  "/register",
]

const ADMIN_PREFIX = "/dashboard"

function decodeSession(token: string | undefined): { role: Role } | null {
  if (!token) return null
  try {
    const payload = jwt.verify(token, SECRET) as { role?: Role }
    return payload.role ? { role: payload.role } : null
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = decodeSession(request.cookies.get("session")?.value)

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  if (isPublic) {
    return NextResponse.next()
  }

  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith(ADMIN_PREFIX) && !hasRole(session.role, "manager")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
