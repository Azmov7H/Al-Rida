"use client"

import * as React from "react"

/**
 * Renders a hidden input carrying the CSRF token read from the `csrf-token`
 * cookie. Place it inside any <form action={serverAction}>. The Server Action
 * reads the `csrfToken` field and compares it to the cookie (double-submit).
 *
 * Next 16: cookies can't be modified in SSR — if the cookie is missing, this
 * fetches GET /api/auth/csrf-token on mount (issues cookie via route handler).
 */
export function CsrfToken() {
  const [token, setToken] = React.useState("")

  const readCookie = () => {
    const match = document.cookie.match(/(?:^|; )csrf-token=([^;]+)/)
    const t = match?.[1]
    if (t) setToken(decodeURIComponent(t))
  }

  React.useEffect(() => {
    if (document.cookie.includes("csrf-token=")) {
      readCookie()
    } else {
      void fetch("/api/auth/csrf-token", { method: "GET", credentials: "include" }).finally(() => {
        readCookie()
      })
    }
  }, [])

  return <input type="hidden" name="csrfToken" value={token} readOnly />
}

/** Returns the CSRF token from the cookie so it can be attached as the
 * `x-csrf-token` header in programmatic fetches (same-origin only). */
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|; )csrf-token=([^;]+)/)
  const token = match?.[1]
  return token ? decodeURIComponent(token) : null
}
