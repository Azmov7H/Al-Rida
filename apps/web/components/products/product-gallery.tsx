"use client"

import * as React from "react"
import Image from "next/image"

export function ProductGallery({
  images,
  name,
}: {
  images: { url: string; alt: string }[]
  name: string
}) {
  const gallery = images.length > 0 ? images : [{ url: "", alt: name }]
  const [active, setActive] = React.useState(0)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
        {gallery[active]?.url ? (
          <Image
            src={gallery[active].url}
            alt={gallery[active].alt || name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-[#64748B]">
            صورة المنتج
          </span>
        )}
      </div>
      {gallery.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                i === active ? "border-[#0F3B73]" : "border-[#E2E8F0]"
              }`}
              aria-label={`صورة ${i + 1}`}
            >
              {img.url ? (
                <Image src={img.url} alt={img.alt || name} fill sizes="120px" className="object-cover" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
