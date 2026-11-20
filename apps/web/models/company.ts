import mongoose, { Schema, type Model } from "mongoose"
import type { CompanyAddress, CompanyData } from "@/types/company"

const addressSchema = new Schema<CompanyAddress>(
  {
    street: { type: String, required: true, maxLength: 128 },
    city: { type: String, required: true, maxLength: 64 },
    governorate: { type: String, required: true, maxLength: 64 },
    postalCode: { type: String, maxLength: 16 },
    country: { type: String, required: true, maxLength: 32 },
  },
  { _id: false },
)

const coordinatesSchema = new Schema(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
  },
  { _id: false },
)

const companySchema = new Schema<CompanyData>(
  {
    slug: { type: String, required: true, default: "default" },
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 300 },
    websiteUrl: { type: String, required: true, maxLength: 256 },
    googleMapsReviewUrl: { type: String, required: true, maxLength: 1024 },
    instaPayLink: { type: String, required: true, maxLength: 1024 },
    cashWalletNumber: { type: String, required: true, maxLength: 64 },
    cashWalletLabel: { type: String, required: true, maxLength: 128 },
    cashWalletInstructions: { type: String, required: true, maxLength: 512 },
    logoImageUrl: { type: String, maxLength: 2048 },
    coverImageUrl: { type: String, maxLength: 2048 },
    phone: { type: String, required: true, maxLength: 30 },
    whatsappNumber: { type: String, required: true, maxLength: 30 },
    whatsappPreMessage: { type: String, maxLength: 120 },
    email: { type: String, required: true, maxLength: 255, lowercase: true },
    address: { type: addressSchema, required: true },
    googleMapsUrl: { type: String, required: true, maxLength: 2048 },
    coordinates: { type: coordinatesSchema },
    primaryArabicFont: { type: String, required: true, default: "cairo", maxLength: 32 },
  },
  { timestamps: true },
)

companySchema.index({ slug: 1 }, { unique: true })

export const Company: Model<CompanyData> =
  mongoose.models.Company ??
  mongoose.model<CompanyData>("Company", companySchema)
