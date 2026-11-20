"use server"

import { redirect } from "next/navigation"
import { createSession } from "@/lib/auth/session"
import { authService } from "@/services/auth.service"
import { logActivity } from "@/lib/activity"
import { loginSchema, registerSchema } from "@/validators/auth"
import { rateLimit, rateLimitKey } from "@/lib/security/rate-limit"
import { verifyCsrfForAction } from "@/lib/security/csrf"
import { audit } from "@/lib/audit"
import { logger } from "@/lib/logger"
import { headers } from "next/headers"

async function clientIp(): Promise<string> {
  const h = await headers()
  const fwd = h.get("x-forwarded-for")
  return fwd?.split(",")[0]?.trim() ?? "unknown"
}

export async function loginAction(formData: FormData) {
  const ip = await clientIp()
  const rl = await rateLimit(rateLimitKey("login", ip), 5, 15_000)
  if (!rl.success) {
    redirect(`/login?error=ratelimit`)
  }

  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "loginAction" })
    void audit({ action: "csrf_failure", metadata: { action: "loginAction" } })
    redirect(`/login?error=csrf`)
  }

  const redirectTo = (formData.get("redirect") as string) || "/dashboard"
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    redirect(`/login?error=invalid&redirect=${encodeURIComponent(redirectTo)}`)
  }

  // Lockout — plan P5.3 (SECURITY_PLAN §2.3)
  if (await authService.isLocked(parsed.data.email)) {
    logger.warn("login_locked", { email: parsed.data.email })
    redirect(`/login?error=locked&redirect=${encodeURIComponent(redirectTo)}`)
  }

  const user = await authService.verifyCredentials(parsed.data)
  if (!user) {
    await audit({
      actorEmail: parsed.data.email,
      actorRole: "unknown",
      action: "auth.login.failure",
      target: "auth",
      metadata: { ip },
    })
    redirect(`/login?error=credentials&redirect=${encodeURIComponent(redirectTo)}`)
  }

  await createSession({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  })
  await audit({
    actorId: user._id.toString(),
    actorEmail: user.email,
    actorRole: user.role,
    action: "auth.login.success",
    target: "auth",
    metadata: { ip },
  })
  redirect(redirectTo)
}

export async function registerAction(formData: FormData) {
  const rl = await rateLimit(rateLimitKey("register", "global"), 5, 60_000)
  if (!rl.success) {
    redirect("/register?error=ratelimit")
  }

  if (!(await verifyCsrfForAction(formData))) {
    logger.warn("csrf_failure", { action: "registerAction" })
    redirect("/register?error=csrf")
  }

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
    await audit({
      actorId: user._id.toString(),
      actorEmail: email,
      actorRole: "customer",
      action: "auth.register",
      target: "user",
      targetId: user._id.toString(),
    })
  } catch {
    redirect("/register?error=exists")
  }
  redirect("/dashboard")
}
