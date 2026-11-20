import type { Metadata } from "next"
import Image from "next/image"
import { connectDB } from "@/lib/db"
import { brandRepository } from "@/repositories/brand.repository"

export const metadata: Metadata = {
  title: "العلامات التجارية",
  description: "علامات تصنيع الأبواب والآقفال التي نوزعها — عالمية ومحلية معتمدة.",
}

export const dynamic = "force-dynamic"

async function loadBrands() {
  try {
    await connectDB()
    return await brandRepository.list()
  } catch {
    return []
  }
}

export default async function BrandsPage() {
  const brands = await loadBrands()

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">العلامات التجارية</h1>
        <p className="mt-2 text-[#64748B]">
          نوزع منتجات أصلية من كبرى العلامات العالمية والمحلية.
        </p>
      </div>

      {brands.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center text-[#64748B]">
          لا توجد علامات تجارية لعرضها حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((b) => (
            <div
              key={b._id?.toString()}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm"
            >
              {b.logo ? (
                <div className="relative size-16 overflow-hidden rounded-lg bg-[#F8FAFC]">
                  <Image src={b.logo} alt={b.name} fill sizes="64px" className="object-contain" />
                </div>
              ) : (
                <span className="flex size-16 items-center justify-center rounded-lg bg-[#0F3B73]/10 text-xl font-bold text-[#0F3B73]">
                  {b.name.charAt(0)}
                </span>
              )}
              <p className="text-sm font-semibold text-[#1E293B]">{b.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
