import mongoose, { Schema, type Model } from "mongoose"

/**
 * Testimonial — moderated customer testimonials (distinct from Product.Review).
 * Public projection: name, company/role, rating, comment, avatarUrl, createdAt.
 */
export interface ITestimonial {
  _id: mongoose.Types.ObjectId
  name: string
  role?: string
  rating: number
  comment: string
  avatarUrl?: string
  isPublished: boolean
  isVerified: boolean
  sortOrder: number
  slug?: string
  createdAt: Date
  updatedAt: Date
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    slug: { type: String, unique: true },
    name: { type: String, required: true, maxLength: 100 },
    role: { type: String, maxLength: 64 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxLength: 500 },
    avatarUrl: { type: String, maxLength: 2048 },
    isPublished: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

testimonialSchema.index(
  { isPublished: 1, isVerified: 1, sortOrder: 1 },
  { name: "Testimonial_published_verified_order" },
)

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ??
  mongoose.model<ITestimonial>("Testimonial", testimonialSchema)
