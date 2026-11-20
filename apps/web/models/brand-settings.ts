import mongoose, { Schema, type Model } from "mongoose"

export interface IBrandSettings {
  _id: mongoose.Types.ObjectId
  slug: string
  primaryArabicFont: string
  primaryEnglishFont: string
  monospaceFont: string
}

const brandSettingsSchema = new Schema<IBrandSettings>(
  {
    slug: { type: String, required: true, default: "default" },
    primaryArabicFont: { type: String, required: true, enum: ["cairo", "readexPro"], default: "cairo" },
    primaryEnglishFont: { type: String, required: true, enum: ["inter"], default: "inter" },
    monospaceFont: { type: String, required: true, enum: ["jetbrains-mono"], default: "jetbrains-mono" },
  },
  { timestamps: true },
)

brandSettingsSchema.index({ slug: 1 }, { unique: true })

export const BrandSettings: Model<IBrandSettings> =
  mongoose.models.BrandSettings ??
  mongoose.model<IBrandSettings>("BrandSettings", brandSettingsSchema)
