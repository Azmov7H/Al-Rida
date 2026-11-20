import bcrypt from "bcryptjs"
import { userRepository } from "@/repositories/user.repository"
import type { LoginInput, RegisterInput } from "@/validators/auth"

const SALT_ROUNDS = 12

export const authService = {
  /** Lockout check — used by login action/API to show "account locked" state. */
  async isLocked(email: string): Promise<boolean> {
    const user = await userRepository.findByEmail(email)
    return Boolean(user?.lockoutUntil && user.lockoutUntil > new Date())
  },

  async verifyCredentials(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email)
    if (!user) return null

    // Lockout check (P5, SECURITY_PLAN §2.3)
    if (user.lockoutUntil && user.lockoutUntil > new Date()) return null

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (valid) {
      await userRepository.markLoginSuccess(user._id.toString())
      return user
    }

    await userRepository.markLoginFailure(user._id.toString())
    return null
  },

  async register(input: Omit<RegisterInput, "confirmPassword">) {
    const existing = await userRepository.findByEmail(input.email)
    if (existing) {
      throw new Error("Email already registered")
    }
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
    return userRepository.create({
      email: input.email,
      name: input.name,
      passwordHash,
      role: "customer",
    })
  },
}
