import bcrypt from "bcryptjs"
import { readFileSync } from "node:fs"
import { connectDB, mongoose } from "@/lib/db"
import { userRepository } from "@/repositories/user.repository"

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const i = line.indexOf("=")
  if (i > 0 && !line.startsWith("#")) {
    const key = line.slice(0, i).trim()
    const val = line.slice(i + 1).trim().replace(/^"|"$/g, "")
    if (!(key in process.env)) process.env[key] = val
  }
}

const NAME = "ali"
const EMAIL = "ali@alreda.example"
const PASSWORD = "admin"
const ROLE = "admin" as const

async function seedAdmin() {
  await connectDB()

  const existing = await userRepository.findByEmail(EMAIL)
  if (existing) {
    console.log(`Admin user already exists: ${EMAIL}`)
    await mongoose.disconnect()
    return
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 12)
  await userRepository.create({
    email: EMAIL,
    name: NAME,
    passwordHash,
    role: ROLE,
  })

  console.log(`Created admin user: ${EMAIL} (password: ${PASSWORD})`)
  await mongoose.disconnect()
}

seedAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
