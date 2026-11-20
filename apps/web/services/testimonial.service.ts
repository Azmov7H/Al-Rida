import { testimonialRepository } from "@/repositories/testimonial.repository"
import { testimonialAdminSchema } from "@/validators/testimonial"
import { validationError } from "@/lib/errors"
import type { ITestimonial } from "@/models/testimonial"

export interface TestimonialUpsert {
  id?: string
  name: string
  role?: string
  rating: number
  comment: string
  avatarUrl?: string
  isPublished?: boolean
  isVerified?: boolean
  sortOrder?: number
}

/** Upsert testimonial — moderation: default unpublished, default unverified. */
export const testimonialService = {
  async upsert(doc: TestimonialUpsert): Promise<ITestimonial> {
    const parsed = testimonialAdminSchema.safeParse(doc)
    if (!parsed.success) {
      throw validationError(parsed.error.issues.map((i) => ({ path: i.path as string[], message: i.message })))
    }
    const existing = doc.id ? await testimonialRepository.findById(doc.id) : null
    if (existing) {
      await testimonialRepository.upsert({
        _id: existing._id,
        name: parsed.data.name,
        role: parsed.data.role,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        avatarUrl: parsed.data.avatarUrl,
        isPublished: parsed.data.isPublished ?? existing.isPublished,
        isVerified: parsed.data.isVerified ?? existing.isVerified,
        sortOrder: parsed.data.sortOrder ?? existing.sortOrder,
      })
      return (await testimonialRepository.findById(existing._id.toString())) ?? existing
    }
    return testimonialRepository.upsert({
      ...parsed.data,
      isPublished: parsed.data.isPublished ?? false,
      isVerified: parsed.data.isVerified ?? false,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
  },

  async delete(id: string) {
    await testimonialRepository.deleteById(id)
  },

  async setPublished(id: string, isPublished: boolean) {
    return testimonialRepository.setPublished(id, isPublished)
  },

  async setVerified(id: string, isVerified: boolean) {
    return testimonialRepository.setVerified(id, isVerified)
  },
}
