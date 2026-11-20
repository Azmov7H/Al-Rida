"use client"

import { useRef, useEffect, useState } from "react"

/**
 * Renders a hidden input carrying the CSRF token read from the `csrf-token`
 * cookie. Place it inside any <form action={serverAction}>. The Server Action
 * reads the `csrfToken` field and compares it to the cookie (double-submit).
 */
export function CsrfToken() {
  const [token, setToken] = useState("")
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )csrf-token=([^;]+)/)
    const token = match?.[1]
    if (token) setToken(decodeURIComponent(token))
  }, [])

  return (
    <input ref={ref} type="hidden" name="csrfToken" value={token} readOnly />
  )
}

/**
 * Returns the CSRF token from the cookie so it can be attached as the
 * `x-csrf-token` header in programmatic fetches (same-origin only).
 */
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|; )csrf-token=([^;]+)/)
  const token = match?.[1]
  return token ? decodeURIComponent(token) : null
}
