function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  mongoUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  cloudinaryUrl: process.env.CLOUDINARY_URL,
  paymobApiKey: process.env.PAYMOB_API_KEY,
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",
} as const

function requiredProduction(name: string, minLength = 16): string {
  const value = required(name)
  if (process.env.NODE_ENV === "production" && value.length < minLength) {
    throw new Error(`Required env var ${name} must be at least ${minLength} chars in production.`)
  }
  return value
}

export const envProduction = {
  // STRONG production secrets: fail fast on missing/short values (P5).
  jwtSecret: requiredProduction("JWT_SECRET", 32),
  mongoUri: requiredProduction("MONGODB_URI", 10),
} as const
