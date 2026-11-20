import { connectDB } from "@/lib/db"
import { LinkItem } from "@/models/link-item"
import { slugify } from "@/lib/slugify"
import type { ILinkItem, LinkItemCreate } from "@/types/link"

export interface LinkRepository {
  list(): Promise<ILinkItem[]>
  listBySection(section: ILinkItem["section"]): Promise<ILinkItem[]>
  listBySectionEnabled(section: ILinkItem["section"]): Promise<ILinkItem[]>
  findBySlug(slug: string): Promise<ILinkItem | null>
  create(doc: LinkItemCreate): Promise<ILinkItem>
  update(slug: string, doc: LinkItemCreate): Promise<ILinkItem>
  delete(slug: string): Promise<void>
  setEnabled(slug: string, enabled: boolean): Promise<void>
  reorder(updates: Array<{ slug: string; displayOrder: number }>): Promise<void>
}

export const linkRepository: LinkRepository = {
  async list() {
    await connectDB()
    return (await LinkItem.find().sort({ section: 1, displayOrder: 1 }).lean()) ?? []
  },

  async listBySection(section) {
    await connectDB()
    return (await LinkItem.find({ section }).sort({ displayOrder: 1 }).lean()) ?? []
  },

  async listBySectionEnabled(section) {
    await connectDB()
    return (await LinkItem.find({ section, enabled: true }).sort({ displayOrder: 1 }).lean()) ?? []
  },

  async findBySlug(slug) {
    await connectDB()
    return (await LinkItem.findOne({ slug }).lean()) ?? null
  },

  async create(doc: LinkItemCreate) {
    await connectDB()
    const link = new LinkItem({ ...doc, slug: slugify(doc.title) })
    await link.save()
    return link
  },

  async update(slug, doc) {
    await connectDB()
    const updated = await LinkItem.findOneAndUpdate({ slug }, { $set: doc })
    if (!updated) throw new Error(`Link not found: ${slug}`)
    return updated as ILinkItem
  },

  async delete(slug) {
    await connectDB()
    await LinkItem.deleteOne({ slug })
  },

  async setEnabled(slug, enabled) {
    await connectDB()
    await LinkItem.updateOne({ slug }, { $set: { enabled } })
  },

  async reorder(updates) {
    await connectDB()
    for (const u of updates) {
      await LinkItem.updateOne({ slug: u.slug }, { $set: { displayOrder: u.displayOrder } })
    }
  },
}
