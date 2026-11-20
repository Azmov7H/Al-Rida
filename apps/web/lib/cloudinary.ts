import { env } from "@/lib/env"

interface CloudinaryCredentials {
  cloudName: string
  apiKey: string
  apiSecret: string
}

function parseCloudinaryUrl(url: string | undefined): CloudinaryCredentials | null {
  if (!url) return null
  // cloudinary://api_key:api_secret@cloud_name
  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/)
  if (!match || !match[1] || !match[2] || !match[3]) return null
  return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] }
}

export function isCloudinaryConfigured(): boolean {
  return parseCloudinaryUrl(env.cloudinaryUrl) !== null
}

/**
 * Uploads a file to Cloudinary using the unsigned-by-credentials REST API.
 * Returns the secure URL on success.
 */
export async function uploadImage(
  file: File,
  folder = "products",
): Promise<{ url: string }> {
  const creds = parseCloudinaryUrl(env.cloudinaryUrl)
  if (!creds) {
    throw new Error("Cloudinary is not configured (CLOUDINARY_URL missing).")
  }

  const form = new FormData()
  form.append("file", file)
  form.append("folder", folder)
  form.append("api_key", creds.apiKey)

  const timestamp = Math.floor(Date.now() / 1000)
  form.append("timestamp", String(timestamp))

  const toSign = `folder=${folder}&timestamp=${timestamp}${creds.apiSecret}`
  const signature = await sha1(toSign)
  form.append("signature", signature)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${creds.cloudName}/image/upload`,
    { method: "POST", body: form },
  )

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`)
  }

  const data = (await res.json()) as { secure_url?: string }
  if (!data.secure_url) {
    throw new Error("Cloudinary upload returned no secure_url.")
  }
  return { url: data.secure_url }
}

async function sha1(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
