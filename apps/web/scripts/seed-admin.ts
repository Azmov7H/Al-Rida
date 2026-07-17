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

const NAME = "Taha Kasem Alreda"
const EMAIL = "ali@alreda.example"
const PASSWORD = "admin123"
const ROLE = "admin" as const

async function seedAdmin() {
  await connectDB()

  const passwordHash = await bcrypt.hash(PASSWORD, 12)
  const existing = await userRepository.findByEmail(EMAIL)
  if (existing) {
    await userRepository.update(existing._id.toString(), { passwordHash, role: ROLE, name: NAME })
    console.log(`Updated admin user: ${EMAIL} (password: ${PASSWORD})`)
    await mongoose.disconnect()
    return
  }

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
