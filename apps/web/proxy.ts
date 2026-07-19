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
  "/about",
  "/offers",
  "/projects",
  "/contact",
  "/login",
  "/register",
]

// Static / SEO / verification assets that must NEVER be intercepted by auth.
// These are served directly from /public and must return 200 with no redirect.
const PUBLIC_ASSETS = [
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/manifest.webmanifest",
  "/google465111a5cdd76198.html",
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

function isPublicAsset(pathname: string): boolean {
  if (PUBLIC_ASSETS.includes(pathname)) return true
  // Google Search Console HTML verification files: /google*.html
  if (/^\/google[a-zA-Z0-9]+\.html$/.test(pathname)) return true
  // Static directories served from /public
  if (
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/fonts/")
  ) {
    return true
  }
  return false
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Bypass all authentication/redirects for static, SEO and verification files.
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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|google[a-zA-Z0-9]+\\.html|images/|icons/|fonts/).*)",
  ],
}

