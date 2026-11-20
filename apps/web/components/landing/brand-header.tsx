import Link from "next/link"
import { DoorFrameIcon } from "@/components/icons/door-frame-icon"

interface BrandHeaderProps {
  tagline?: string
  name?: string
  description?: string
  websiteUrl?: string
  coverImageUrl?: string
}

/**
 * Brand header — Al-Reda logo + الرضا name + tagline + short professional
 * description (SSR). Design: primary navy, modern serif display, clean gaps.
 */
export function BrandHeader({
  tagline = "حلول مثلية لأوكر الأبواب والأقفال",
  name = "الرضا",
  description = "شركة الرضا: موزع معتمد لأدوات الأبواب (أوكر، أقفال، كوالين)، تقدم حلولاً أصلية عالي الجودة.",
  websiteUrl = "#",
  coverImageUrl,
}: BrandHeaderProps) {
  return (
    <section className="w-full">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 pt-8 md:grid-cols-[1fr_3fr] md:px-10 lg:gap-12 lg:px-20 lg:pt-12">
        <div className="flex flex-col gap-5">
          <p className="text-sm font-semibold text-primary">{tagline}</p>
          <h1 className="text-5xl font-bold leading-[1.15] text-ink md:text-6xl lg:text-7xl">
            {name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-flex max-w-xl items-center gap-2 text-lg leading-relaxed text-muted">
              <DoorFrameIcon className="size-5 shrink-0 text-primary" />
              {description}
            </p>
            {websiteUrl ? (
              <Link
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:underline"
              >
                موقع الشركة ←
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative">
          {coverImageUrl ? (
            <div className="absolute inset-x-4 -top-6 -bottom-0 hidden h-80 rounded-3xl bg-primary/5 bg-cover bg-center md:block" />
          ) : null}
          <p className="mt-6 text-base text-ink md:hidden">{description}</p>
        </div>
      </div>
    </section>
  )
}
