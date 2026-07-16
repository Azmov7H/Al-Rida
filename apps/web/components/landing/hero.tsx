import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { trustIndicators } from "@/lib/landing-data"
import { images } from "@/lib/images"

export function Hero() {
  return (
    <section className="w-full bg-[#F8FAFC]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-2 lg:px-20">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-[#0F3B73]/10 px-4 py-1.5 text-sm font-semibold text-[#0F3B73]">
            موزع معتمد للأقفال والأوكر
          </span>
          <h1 className="text-4xl font-bold leading-tight text-[#1E293B] md:text-5xl lg:text-6xl">
            حلول متكاملة للأقفال والأوكر وإكسسوارات الأبواب
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-[#64748B]">
            شركة الرضا تقدم منتجات أصلية عالية الجودة من أفضل العلامات التجارية
            لتلبية احتياجات المنازل، الشركات، المشروعات، والمقاولين.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#0F3B73] px-7 text-base font-semibold text-white transition-colors hover:bg-[#0C2F5C]"
            >
              تصفح المنتجات
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-transparent px-7 text-base font-semibold text-[#1E293B] transition-colors hover:bg-[#F1F5F9]"
            >
              تواصل معنا
              <ArrowLeft className="size-4" />
            </Link>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustIndicators.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-xs font-medium text-[#1E293B]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <Image
            src={images.hero}
            alt="أدوات الأبواب والآقفال الاحترافية"
            width={1200}
            height={900}
            priority
            className="aspect-[4/3] rounded-2xl border border-[#E2E8F0] object-cover"
          />
          <div className="absolute -bottom-4 -start-4 hidden rounded-xl bg-white px-5 py-3 shadow-md ring-1 ring-[#E2E8F0] sm:block">
            <p className="text-xs text-[#64748B]">منتجات أصلية</p>
            <p className="text-lg font-bold text-[#0F3B73]">معتمدة 100%</p>
          </div>
        </div>
      </div>
    </section>
  )
}
