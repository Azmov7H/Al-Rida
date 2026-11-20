import {
  BadgeCheck,
  Banknote,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Wallet,
} from "lucide-react"
import type * as React from "react"
import type { LinkIconKey } from "@/types/link"

export const ICONS: Partial<Record<LinkIconKey, React.ReactNode>> = {
  googleMapsReviews: <BadgeCheck className="size-6" />,
  instaPay: <CreditCard className="size-6" />,
  cashWallet: <Wallet className="size-6" />,
  whatsapp: <MapPin className="size-6" />,
  officialWebsite: <Globe className="size-6" />,
  mapPin: <MapPin className="size-6" />,
  mail: <Mail className="size-6" />,
  phone: <Phone className="size-6" />,
  shieldCheck: <ShieldCheck className="size-6" />,
  custom: <Banknote className="size-6" />,
}
