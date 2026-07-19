import { connectDB } from "@/lib/db"
import { Content, type IContent } from "@/models/content"

export const contentRepository = {
  async list(): Promise<IContent[]> {
    await connectDB()
    return Content.find().sort({ section: 1 }).lean()
  },
  async getBySection(section: string): Promise<IContent | null> {
    await connectDB()
    return Content.findOne({ section }).lean()
  },
  async upsert(section: string, data: Record<string, unknown>, title?: string): Promise<IContent> {
    await connectDB()
    return Content.findOneAndUpdate(
      { section },
      { $set: { section, data, ...(title !== undefined ? { title } : {}) } },
      { new: true, upsert: true },
    ).lean()
  },
}
