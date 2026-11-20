"use server"

import { redirect } from "next/navigation"
import { destroySession, getSession } from "@/lib/auth/session"
import { audit } from "@/lib/audit"

export async function logoutAction() {
  const session = await getSession()
  await destroySession()
  void audit({
    actorId: session?.id,
    actorEmail: session?.email,
    actorRole: session?.role,
    action: "auth.logout",
    target: "auth",
  })
  redirect("/login")
}
