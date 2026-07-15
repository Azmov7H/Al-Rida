export const ROLES = ["customer", "manager", "admin"] as const

export type Role = (typeof ROLES)[number]

export const ROLE_HIERARCHY: Record<Role, number> = {
  customer: 0,
  manager: 1,
  admin: 2,
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}
