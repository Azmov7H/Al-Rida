import { BrandSettings } from "@/models/brand-settings"
import type { IBrandSettings } from "@/models/brand-settings"

export interface BrandSettingsRepository {
  getDefault(): Promise<IBrandSettings | null>
  getOrCreateDefault(): Promise<IBrandSettings>
  upsertDefault(data: Partial<IBrandSettings>): Promise<void>
}

export const brandSettingsRepository: BrandSettingsRepository = {
  async getDefault() {
    return (await BrandSettings.findOne({ slug: "default" }).lean()) ?? null
  },

  async getOrCreateDefault() {
    const existing = await this.getDefault()
    if (existing) return existing
    return BrandSettings.create({ slug: "default" }) as Promise<IBrandSettings>
  },

  async upsertDefault(data: Partial<IBrandSettings>) {
    await BrandSettings.updateOne({ slug: "default" }, { $set: data }, { upsert: true })
  },
}
