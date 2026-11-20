import { linkRepository } from "@/repositories/link.repository"
import { linkItemSchema } from "@/validators/link"
import { conflict } from "@/lib/errors"
import { slugify } from "@/lib/slugify"
import type { ILinkItem, LinkItemCreate } from "@/types/link"

export const linksService = {
  async list(): Promise<ILinkItem[]> {
    return linkRepository.list()
  },

  async createLink(doc: LinkItemCreate): Promise<ILinkItem> {
    const parsed = linkItemSchema.safeParse(doc)
    if (!parsed.success) {
      throw conflict(parsed.error.issues[0]?.message ?? "Invalid link data")
    }
    // Duplicate title/slug protection (plan §3.2).
    const slug = slugify(parsed.data.title)
    const existing = (await linkRepository.list()).find(
      (l) => l.slug === slug || l.title === parsed.data.title,
    )
    if (existing) {
      throw conflict(`قبلاً موجود "${existing.title}" — اختر عنواناً مختلفاً.`)
    }
    return linkRepository.create(parsed.data)
  },

  async updateLink(slug: string, doc: LinkItemCreate): Promise<ILinkItem> {
    const parsed = linkItemSchema.safeParse(doc)
    if (!parsed.success) {
      throw conflict(parsed.error.issues[0]?.message ?? "Invalid link data")
    }
    // Keep the URL stable by keeping the existing slug (update by slug).
    return linkRepository.update(slug, parsed.data)
  },

  async deleteLink(slug: string) {
    await linkRepository.delete(slug)
  },

  async setEnabled(slug: string, enabled: boolean) {
    await linkRepository.setEnabled(slug, enabled)
  },

  async reorderLinks(updates: Array<{ slug: string; displayOrder: number }>) {
    await linkRepository.reorder(updates)
  },

  async findBySlug(slug: string) {
    return linkRepository.findBySlug(slug)
  },
}
