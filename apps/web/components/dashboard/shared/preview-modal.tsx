"use client"

import * as React from "react"
import { X } from "lucide-react"
import { ActionCard } from "@/components/landing/action-card"
import {
  BadgeCheck,
  CreditCard,
  Globe,
  MapPin,
  Wallet,
} from "lucide-react"
import type { ILinkItem } from "@/types/link"

const ICONS: Partial<Record<ILinkItem["iconKey"], React.ReactNode>> = {
  googleMapsReviews: <BadgeCheck className="size-6" />,
  instaPay: <CreditCard className="size-6" />,
  cashWallet: <Wallet className="size-6" />,
  whatsapp: <MapPin className="size-6" />,
  officialWebsite: <Globe className="size-6" />,
  mapPin: <MapPin className="size-6" />,
  mail: <Globe className="size-6" />,
  phone: <Globe className="size-6" />,
  custom: <Globe className="size-6" />,
}

const DEFAULT_BUTTONS: Record<string, string> = {
  googleMapsReviews: "قيّمنا على خرائط جوجل",
  instaPay: "الدفع عبر InstaPay",
  cashWallet: "شراء بالمحفظة",
  whatsapp: "راسلنا على واتساب",
  officialWebsite: "موقع الشركة",
}

/** Preview card — renders ActionCard as the public landing would. */
function PreviewCard({ link }: { link: ILinkItem }) {
  return (
    <ActionCard
      icon={ICONS[link.iconKey] ?? <Globe className="size-6" />}
      title={link.title}
      description={link.description}
      href={link.url}
      buttonText={DEFAULT_BUTTONS[link.iconKey] ?? link.title}
    />
  )
}

export function PreviewModal({ link, onClose }: { link: ILinkItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute start-4 top-4 rounded-lg p-2 text-muted transition-colors hover:bg-bg hover:text-ink"
        >
          <X className="size-5" />
        </button>
        <h3 className="mb-4 text-lg font-bold text-ink">معاينة على الصفحة الرئيسية</h3>
        <PreviewCard link={link} />
      </div>
    </div>
  )
}
