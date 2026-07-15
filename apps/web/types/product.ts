import type { ProductStatus, Seo } from "@/types"

export interface ProductSpecification {
  key: string
  value: string
}

export interface ProductImage {
  url: string
  alt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  barcode?: string
  brandId: string
  categoryId: string
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
  images: ProductImage[]
  documents: string[]
  videos: string[]
  specifications: ProductSpecification[]
  relatedProducts: string[]
  tags: string[]
  seo: Seo
  status: ProductStatus
}
