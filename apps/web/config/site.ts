export const siteConfig = {
  name: "Al Rida",
  description:
    "Premium door hardware e-commerce — locks, handles, hinges, cylinders, smart locks, and accessories.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en",
  currency: "EGP",
  contactEmail: "sales@alreda.example",
} as const

export type SiteConfig = typeof siteConfig
