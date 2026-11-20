/**
 * CompanyData — public business settings for Al-Reda.
 * Source: `Company` singleton document (Mongoose model).
 * Defined in DATABASE_DESIGN.md (P3).
 */
export interface CompanyAddress {
  street: string
  city: string
  governorate: string
  postalCode?: string
  country: string
}

export interface CompanyData {
  slug: string
  name: string
  description: string
  websiteUrl: string
  googleMapsReviewUrl: string
  instaPayLink: string
  cashWalletNumber: string
  cashWalletLabel: string
  cashWalletInstructions: string
  logoImageUrl?: string
  coverImageUrl?: string
  phone: string
  whatsappNumber: string
  whatsappPreMessage?: string
  email: string
  address: CompanyAddress
  googleMapsUrl: string
  coordinates?: { lat: number; lng: number }
  primaryArabicFont: string
  updatedAt: Date
}

export interface CompanySaveInput {
  name?: string
  description?: string
  websiteUrl?: string
  googleMapsReviewUrl?: string
  instaPayLink?: string
  cashWalletNumber?: string
  cashWalletLabel?: string
  cashWalletInstructions?: string
  logoImageUrl?: string
  coverImageUrl?: string
  phone?: string
  whatsappNumber?: string
  whatsappPreMessage?: string
  email?: string
  address?: Partial<CompanyAddress>
  googleMapsUrl?: string
  primaryArabicFont?: string
}
