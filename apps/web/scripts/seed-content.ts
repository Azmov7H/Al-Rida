import { readFileSync } from "node:fs"
import { connectDB } from "@/lib/db"
import { contentRepository } from "@/repositories/content.repository"
import { statistics, contactInfo } from "@/lib/landing-data"

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const i = line.indexOf("=")
  if (i > 0 && !line.startsWith("#")) {
    const key = line.slice(0, i).trim()
    const val = line.slice(i + 1).trim().replace(/^"|"$/g, "")
    if (!(key in process.env)) process.env[key] = val
  }
}

async function main() {
  await connectDB()

  await contentRepository.upsert(
    "statistics",
    { items: statistics },
    "الأرقام والإحصائيات",
  )

  await contentRepository.upsert(
    "company",
    {
      name: "شركة الرضا",
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address,
    },
    "معلومات الشركة",
  )

  console.log("Content seeded successfully.")
  process.exit(0)
}

void main()
