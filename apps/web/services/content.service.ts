import { connectDB } from "@/lib/db"
import { contentRepository } from "@/repositories/content.repository"
import { statistics, contactInfo } from "@/lib/landing-data"

/** Legacy FALLBACK — frozen sections for legacy pages (products removed in A6). */
const FALLBACK: Record<string, Record<string, unknown>> = {
  statistics: { items: statistics },
  company: {
    name: "شركة الرضا",
    email: contactInfo.email,
    phone: contactInfo.phone,
    address: contactInfo.address,
  },
}

export async function getContent(
  section: string,
): Promise<Record<string, unknown>> {
  try {
    await connectDB()
    const doc = await contentRepository.getBySection(section)
    if (doc && doc.data && Object.keys(doc.data).length > 0) {
      return doc.data as Record<string, unknown>
    }
  } catch {
    // fall through to defaults
  }
  return FALLBACK[section] ?? {}
}
