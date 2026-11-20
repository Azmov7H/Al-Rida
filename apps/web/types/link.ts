/**
 * ILinkItem — dynamic landing links (`LinkItem` model, P3).
 */
export type LinkIconKey =
  | "googleMapsReviews"
  | "instaPay"
  | "cashWallet"
  | "whatsapp"
  | "officialWebsite"
  | "mapPin"
  | "mail"
  | "phone"
  | "globe"
  | "shieldCheck"
  | "custom"

export type LinkSection = "main_actions" | "footer" | "navbar"

export type LinkTargetType = "external" | "internal"

export interface ILinkItem {
  slug: string
  title: string
  description?: string
  url: string
  iconKey: LinkIconKey
  section: LinkSection
  displayOrder: number
  enabled: boolean
  internalHref?: string
  targetType?: LinkTargetType
  createdAt: Date
  updatedAt: Date
}

/** Create shape (slug generated server-side). */
export interface LinkItemCreate {
  title: string
  description?: string
  url: string
  iconKey: LinkIconKey
  section: LinkSection
  displayOrder?: number
  enabled?: boolean
  internalHref?: string
  targetType?: LinkTargetType
}
