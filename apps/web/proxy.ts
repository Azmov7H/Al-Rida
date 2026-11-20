import { NextResponse, type NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { hasRole, type Role } from "@/constants/roles"
import { logger } from "@/lib/logger"

const SECRET = process.env.JWT_SECRET ?? "change-me"

// --- Security headers applied to every proxied response ---
const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://images.unsplash.com https://res.cloudinary.com",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(self)",
  "X-Content-Type-Options": "nosniff",
}

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

function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }
  return response
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
    return withSecurityHeaders(NextResponse.next())
  }

  // Unauthenticated → login (preserve intended destination).
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    logger.warn("auth_required_redirect", { pathname })
    return withSecurityHeaders(NextResponse.redirect(url))
  }

  // Staff-only area.
  if (pathname.startsWith(STAFF_PREFIX) && !hasRole(session.role, "manager")) {
    logger.warn("forbidden_staff_area", { pathname, role: session.role })
    return withSecurityHeaders(NextResponse.redirect(new URL("/unauthorized", request.url)))
  }

  return withSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|google[a-zA-Z0-9]+\\.html|images/|icons/|fonts/).*)",
  ],
}
