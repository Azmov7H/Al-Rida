import { NextResponse, type NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { hasRole, type Role } from "@/constants/roles"
import { logger } from "@/lib/logger"
import { audit } from "@/lib/audit"

const SECRET = process.env.JWT_SECRET ?? "change-me"

// NOTE: Security headers (CSP, X-Frame-Options, HSTS, etc.) are applied globally via
// `next.config.ts headers()` — single source of truth (deduped from this file, P5).

// --- Route protection map ---
const PUBLIC_PATHS = [
  "/",
  "/categories",
  "/brands",
  "/about",
  "/offers",
  "/projects",
  "/contact",
  "/login",
  "/register",
  // Public business-data APIs (read-only, rate-limited, safe projections)
  "/api/company",
  "/api/links",
  "/api/testimonials",
  // CSRF-token issuance endpoint (public, tiny)
  "/api/auth/csrf-token",
]

// Paths that require a staff (manager/admin) session.
const STAFF_PREFIX = "/dashboard"

// Static / SEO / verification assets that must NEVER be intercepted by auth.
const PUBLIC_ASSETS = [
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/manifest.webmanifest",
  "/google465111a5cdd76198.html",
]

function decodeSession(token: string | undefined): { id: string; role: Role } | null {
  if (!token) return null
  try {
    const payload = jwt.verify(token, SECRET) as { id?: string; role?: Role }
    if (!payload.id || !payload.role) return null
    return { id: payload.id, role: payload.role }
  } catch {
    return null
  }
}

function isPublicAsset(pathname: string): boolean {
  if (PUBLIC_ASSETS.includes(pathname)) return true
  if (/^\/google[a-zA-Z0-9]+\.html$/.test(pathname)) return true
  return (
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/fonts/")
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Bypass auth/redirects for static, SEO and verification files.
  if (isPublicAsset(pathname)) {
    return NextResponse.next()
  }

  const session = decodeSession(request.cookies.get("session")?.value)

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
  if (isPublic) {
    return NextResponse.next()
  }

  // Unauthenticated → login (preserve intended destination).
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    logger.warn("auth_required_redirect", { pathname })
    return NextResponse.redirect(url)
  }

  // Staff-only area.
  if (pathname.startsWith(STAFF_PREFIX) && !hasRole(session.role, "manager")) {
    logger.warn("forbidden_staff_area", { pathname, role: session.role })
    void audit({
      action: "auth_forbidden",
      metadata: { pathname, role: session.role },
    })
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|google[a-zA-Z0-9]+\\.html|images/|icons/|fonts/).*)",
  ],
}
