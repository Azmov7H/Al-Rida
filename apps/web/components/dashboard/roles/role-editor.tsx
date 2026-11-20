"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { ROLES, type Role } from "@/constants/roles"
import { updateUserRoleAction } from "@/app/(dashboard)/dashboard/users/actions"
import { Check } from "lucide-react"

const ROLE_LABEL: Record<Role, string> = {
  customer: "عميل",
  manager: "مشرف",
  admin: "مدير",
}

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F3B73] text-white disabled:opacity-50"
      aria-label="حفظ الدور"
    >
      <Check className="size-4" />
    </button>
  )
}

export function RoleEditor({
  userId,
  currentRole,
}: {
  userId: string
  currentRole: Role
}) {
  const [role, setRole] = React.useState<Role>(currentRole)

  return (
    <form action={updateUserRoleAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={userId} />
      <select
        name="role"
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-2 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABEL[r]}
          </option>
        ))}
      </select>
      <Submit />
    </form>
  )
}
