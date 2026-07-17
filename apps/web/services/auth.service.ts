import bcrypt from "bcryptjs"
import { userRepository } from "@/repositories/user.repository"
import type { LoginInput, RegisterInput } from "@/validators/auth"

const SALT_ROUNDS = 12

export const authService = {
  async verifyCredentials(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email)
    if (!user) return null
    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) return null
    return user
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
