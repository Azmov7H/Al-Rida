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
    return (await LinkItem.find().sort({ section: 1, displayOrder: 1 }).lean()) ?? []
  },

  async listBySection(section) {
    return (await LinkItem.find({ section }).sort({ displayOrder: 1 }).lean()) ?? []
  },

  async listBySectionEnabled(section) {
    return (await LinkItem.find({ section, enabled: true }).sort({ displayOrder: 1 }).lean()) ?? []
  },

  async findBySlug(slug) {
    return (await LinkItem.findOne({ slug }).lean()) ?? null
  },

  async create(doc: LinkItemCreate) {
    const link = new LinkItem({ ...doc, slug: slugify(doc.title) })
    await link.save()
    return link
  },

  async update(slug, doc) {
    const updated = await LinkItem.findOneAndUpdate({ slug }, { $set: doc })
    if (!updated) throw new Error(`Link not found: ${slug}`)
    return updated as ILinkItem
  },

  async delete(slug) {
    await LinkItem.deleteOne({ slug })
  },

  async setEnabled(slug, enabled) {
    await LinkItem.updateOne({ slug }, { $set: { enabled } })
  },

  async reorder(updates) {
    for (const u of updates) {
      await LinkItem.updateOne({ slug: u.slug }, { $set: { displayOrder: u.displayOrder } })
    }
  },
}
