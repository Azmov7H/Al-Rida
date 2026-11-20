import { connectDB } from "@/lib/db"
import { Company } from "@/models/company"
import type { CompanyData } from "@/types/company"

export interface CompanyRepository {
  getDefault(): Promise<CompanyData | null>
  getBySlug(slug: string): Promise<CompanyData | null>
  upsertDefault(data: Partial<CompanyData>): Promise<void>
  createDefault(data: Partial<CompanyData>): Promise<CompanyData>
}

export const companyRepository: CompanyRepository = {
  async getDefault() {
    await connectDB()
    return (await Company.findOne({ slug: "default" }).lean()) ?? null
  },

  async getBySlug(slug: string) {
    await connectDB()
    return (await Company.findOne({ slug }).lean()) ?? null
  },

  async upsertDefault(data: Partial<CompanyData>) {
    await connectDB()
    await Company.updateOne({ slug: "default" }, { $set: data }, { upsert: true })
  },

  async createDefault(data: Partial<CompanyData>) {
    await connectDB()
    return Company.create({ slug: "default", ...data } as Partial<CompanyData>) as Promise<CompanyData>
  },
}
