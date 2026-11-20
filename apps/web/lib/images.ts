const BASE = "https://images.unsplash.com"

export const images = {
  hero: `${BASE}/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80`,
  showroom: `${BASE}/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80`,
  warehouse: `${BASE}/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1200&q=80`,
  installation: `${BASE}/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80`,
  professional: `${BASE}/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80`,
}

export const categoryImages = {
  الكوالين: `${BASE}/photo-1627463439498-c9b3f8f1d1f3?auto=format&fit=crop&w=800&q=80`,
  أوكر: `${BASE}/photo-1558991360-2757d8e878f5?auto=format&fit=crop&w=800&q=80`,
  مفصلات: `${BASE}/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80`,
  اسطوانات: `${BASE}/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80`,
  "أقفال ذكية": `${BASE}/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80`,
  "إكسسوارات الأبواب": `${BASE}/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80`,
} as const

export const DEFAULT_CATEGORY_IMAGE = categoryImages["إكسسوارات الأبواب"]

export function categoryImage(name: string): string {
  return categoryImages[name as keyof typeof categoryImages] ?? DEFAULT_CATEGORY_IMAGE
}

export const productImages: string[] = [
  `${BASE}/photo-1627463439498-c9b3f8f1d1f3?auto=format&fit=crop&w=600&q=80`,
  `${BASE}/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80`,
  `${BASE}/photo-1558991360-2757d8e878f5?auto=format&fit=crop&w=600&q=80`,
  `${BASE}/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80`,
]

export const projectImages: string[] = [
  `${BASE}/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80`,
  `${BASE}/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80`,
  `${BASE}/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80`,
  `${BASE}/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80`,
]

export function productImage(index: number): string {
  return productImages[index % productImages.length]!
}

export function projectImage(index: number): string {
  return projectImages[index % projectImages.length]!
}
