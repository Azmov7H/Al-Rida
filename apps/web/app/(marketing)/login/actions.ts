"use server"

import { redirect } from "next/navigation"
import { createSession } from "@/lib/auth/session"
import { authService } from "@/services/auth.service"
import { logActivity } from "@/lib/activity"
import { loginSchema, registerSchema } from "@/validators/auth"

export async function loginAction(formData: FormData) {
  const redirectTo = (formData.get("redirect") as string) || "/dashboard"
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    redirect(`/login?error=invalid&redirect=${encodeURIComponent(redirectTo)}`)
  }

  const user = await authService.verifyCredentials(parsed.data)
  if (!user) {
    redirect(`/login?error=credentials&redirect=${encodeURIComponent(redirectTo)}`)
  }

  await createSession({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  })
  redirect(redirectTo)
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })
  if (!parsed.success) {
    redirect("/register?error=invalid")
  }

  const { name, email, password } = parsed.data
  try {
    const user = await authService.register({ name, email, password })
    await createSession({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })
    void logActivity({
      actor: name,
      actorRole: "customer",
      action: "user.registered",
      entity: "user",
      entityId: user._id.toString(),
      message: `انضم مستخدم جديد: ${name} (${email})`,
    })
  } catch {
    redirect("/register?error=exists")
  }
  redirect("/dashboard")
}
