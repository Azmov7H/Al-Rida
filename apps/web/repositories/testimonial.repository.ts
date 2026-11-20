import { randomBytes } from "node:crypto"
import { Testimonial } from "@/models/testimonial"
import type { ITestimonial } from "@/models/testimonial"
import { slugify } from "@/lib/slugify"

function generateTestimonialSlug(name: string): string {
  return `${slugify(name)}-${randomBytes(2).toString("hex")}`
}

export type PublicTestimonial = Omit<ITestimonial, "isPublished" | "isVerified" | "slug">

export interface TestimonialRepository {
  getAll(filter?: {
    isPublished?: boolean
    isVerified?: boolean
  }): Promise<ITestimonial[]>
  getPublishedVerified(): Promise<PublicTestimonial[]>
  findById(id: string): Promise<ITestimonial | null>
  upsert(doc: Partial<ITestimonial>): Promise<ITestimonial>
  deleteById(id: string): Promise<void>
  setPublished(id: string, isPublished: boolean): Promise<ITestimonial | null>
  setVerified(id: string, isVerified: boolean): Promise<ITestimonial | null>
  countUnpublished(): Promise<number>
}

export const testimonialRepository: TestimonialRepository = {
  async getAll(filter = {}) {
    return (await Testimonial.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean()) ?? []
  },

  async getPublishedVerified() {
    const docs = (await Testimonial.find({ isPublished: true, isVerified: true })
      .sort({ sortOrder: 1 })
      .select({ isPublished: 0, isVerified: 0, slug: 0 })
      .lean()) ?? []
    return docs as PublicTestimonial[]
  },

  async findById(id) {
    return (await Testimonial.findById(id).lean()) ?? null
  },

  async upsert(doc: Partial<ITestimonial>) {
    const existing =
      (doc._id && (await Testimonial.findById(doc._id))) ||
      (doc.slug && (await Testimonial.findOne({ slug: doc.slug }))) ||
      (doc.name && (await Testimonial.findOne({ name: doc.name }))) ||
      null
    if (existing) {
      await Testimonial.updateOne({ _id: existing._id }, { $set: doc })
      return (await Testimonial.findById(existing._id).lean()) as ITestimonial
    }
    const created = await Testimonial.create({
      ...doc,
      slug: doc.slug ?? generateTestimonialSlug(doc.name ?? "review"),
    })
    return created as ITestimonial
  },

  async deleteById(id) {
    await Testimonial.deleteOne({ _id: id })
  },

  async setPublished(id, isPublished) {
    await Testimonial.updateOne({ _id: id }, { $set: { isPublished } })
    return (await Testimonial.findById(id).lean()) ?? null
  },

  async setVerified(id, isVerified) {
    await Testimonial.updateOne({ _id: id }, { $set: { isVerified } })
    return (await Testimonial.findById(id).lean()) ?? null
  },

  async countUnpublished() {
    return (await Testimonial.countDocuments({ isPublished: false })) ?? 0
  },
}
