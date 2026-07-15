import mongoose, { Schema, type Model } from "mongoose"
import type { ProductStatus, Seo } from "@/types"

export interface IProduct {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  sku: string
  barcode?: string
  brand: mongoose.Types.ObjectId
  category: mongoose.Types.ObjectId
  price: number
  salePrice?: number
  cost?: number
  stock: number
  weight?: number
  dimensions?: string
  material?: string
  finish?: string
  doorType?: string
  openingDirection?: string
  securityLevel?: string
  country?: string
  warranty?: string
  images: { url: string; alt: string }[]
  documents: string[]
  videos: string[]
  specifications: { key: string; value: string }[]
  relatedProducts: mongoose.Types.ObjectId[]
  tags: string[]
  seo: Seo
  status: ProductStatus
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    cost: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    weight: { type: Number },
    dimensions: { type: String },
    material: { type: String },
    finish: { type: String },
    doorType: { type: String },
    openingDirection: { type: String },
    securityLevel: { type: String },
    country: { type: String },
    warranty: { type: String },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" },
      },
    ],
    documents: [{ type: String }],
    videos: [{ type: String }],
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    tags: [{ type: String }],
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: [{ type: String }],
    },
    status: {
      type: String,
      enum: ["active", "draft", "out_of_stock", "archived"],
      default: "draft",
    },
  },
  { timestamps: true },
)

export const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", productSchema)
