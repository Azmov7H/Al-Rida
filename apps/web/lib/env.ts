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
