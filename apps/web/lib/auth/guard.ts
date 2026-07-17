import { getSession, type SessionPayload } from "@/lib/auth/session"
import { unauthorized, forbidden } from "@/lib/responses"
import { NextResponse } from "next/server"
import { hasRole, type Role } from "@/constants/roles"

export async function requireUser(): Promise<
  { session: SessionPayload } | { response: NextResponse }
> {
  const session = await getSession()
  if (!session) return { response: unauthorized() }
  return { session }
}

export async function requireRole(
  role: Role,
): Promise<{ session: SessionPayload } | { response: NextResponse }> {
  const session = await getSession()
  if (!session) return { response: unauthorized() }
  if (!hasRole(session.role, role)) return { response: forbidden() }
  return { session }
}
