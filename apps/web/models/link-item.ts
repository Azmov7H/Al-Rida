import mongoose, { Schema, type Model } from "mongoose"
import type { ILinkItem, LinkIconKey } from "@/types/link"

const iconKeys: LinkIconKey[] = [
  "googleMapsReviews",
  "instaPay",
  "cashWallet",
  "whatsapp",
  "officialWebsite",
  "mapPin",
  "mail",
  "phone",
  "globe",
  "shieldCheck",
  "custom",
]

const linkItemSchema = new Schema<ILinkItem>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, maxLength: 80 },
    description: { type: String, maxLength: 120 },
    url: { type: String, required: true, maxLength: 2048 },
    iconKey: { type: String, required: true, enum: iconKeys },
    section: {
      type: String,
      required: true,
      enum: ["main_actions", "footer", "navbar"],
    },
    displayOrder: { type: Number, required: true },
    enabled: { type: Boolean, default: true },
    internalHref: { type: String, maxLength: 512 },
  },
  { timestamps: true },
)

linkItemSchema.index({ section: 1, enabled: 1, displayOrder: 1 }, { name: "LinkItem_section_enabled_order" })

export const LinkItem: Model<ILinkItem> =
  mongoose.models.LinkItem ?? mongoose.model<ILinkItem>("LinkItem", linkItemSchema)
