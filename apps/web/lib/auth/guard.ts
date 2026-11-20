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

/**
 * Allows the action if the caller owns the resource (id matches) OR has at
 * least the required role. Use for user-scoped routes like /api/users/me.
 */
export async function requireSelfOrRole(
  resourceOwnerId: string,
  role: Role,
): Promise<{ session: SessionPayload } | { response: NextResponse }> {
  const session = await getSession()
  if (!session) return { response: unauthorized() }
  if (session.id !== resourceOwnerId && !hasRole(session.role, role)) {
    return { response: forbidden() }
  }
  return { session }
}
