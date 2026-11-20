import type * as React from "react"
import { BadgeCheck, CreditCard, Globe, Wallet } from "lucide-react"
import { ActionCard, type ActionCardData } from "./action-card"
import { WhatsAppCard } from "./whatsapp-card"
import { WalletCard } from "./wallet-card"
import { Section, SectionTitle } from "./section"
import type { ILinkItem } from "@/types/link"

export interface WalletDetails {
  number: string
  label: string
  instructions: string
}

export interface ActionsCardsProps {
  /** Main actions (DB `LinkItem`, section = main_actions). Fallback = static DEFAULT_ACTION_LINKS. */
  links?: ILinkItem[]
  whatsAppNumber?: string
  whatsAppPreMessage?: string
  walletDetails?: WalletDetails
}

export const DEFAULT_ACTION_LINKS: ILinkItem[] = [
  {
    slug: "maps-reviews",
    title: "آراء الزبائر على خرائط جوجل",
    description: "شارك تجربتك مع عملاء المنطقة وحمّل التقييم.",
    url: "#",
    iconKey: "googleMapsReviews",
    section: "main_actions",
    displayOrder: 0,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "instapay",
    title: "InstaPay",
    description: "ادفع بطريقة آمنة وشاهد عملياتك القادمة.",
    url: "#",
    iconKey: "instaPay",
    section: "main_actions",
    displayOrder: 1,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "wallet",
    title: "محفظة الشركة",
    description: "طريقة مباشرة للدفع عبر المحفظة النقدية.",
    url: "#",
    iconKey: "cashWallet",
    section: "main_actions",
    displayOrder: 2,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "whatsapp",
    title: "رسالة واتساب",
    description: "تواصل معنا على واتساب فوراً.",
    url: "#",
    iconKey: "whatsapp",
    section: "main_actions",
    displayOrder: 3,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "website",
    title: "الموقع الرسمي",
    description: "استكشف المنتجات والخدمات على موقعنا الرسمي.",
    url: "#",
    iconKey: "officialWebsite",
    section: "main_actions",
    displayOrder: 4,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const ICONS: Record<ILinkItem["iconKey"], React.ReactNode> = {
  googleMapsReviews: <BadgeCheck className="size-6" />,
  instaPay: <CreditCard className="size-6" />,
  cashWallet: <Wallet className="size-6" />,
  whatsapp: <></>, // rendered separately as WhatsAppCard
  officialWebsite: <Globe className="size-6" />,
  globe: <Globe className="size-6" />,
  mapPin: <Wallet className="size-6" />,
  mail: <Globe className="size-6" />,
  phone: <Globe className="size-6" />,
  shieldCheck: <Wallet className="size-6" />,
  custom: <Globe className="size-6" />,
}

const DEFAULT_BUTTONS: Record<string, string> = {
  googleMapsReviews: "قيّمنا على خرائط جوجل",
  instaPay: "الدفع عبر InstaPay",
  cashWallet: "شراء بالمحفظة",
  whatsapp: "راسلنا على واتساب",
  officialWebsite: "موقع الشركة",
}

/**
 * Main Actions section — the 5 business actions of Al-Reda (design §3.2):
 *   1. Google Maps Reviews — external link (قيّمنا على خرائط جوجل)
 *   2. InstaPay — payment link (الدفع عبر InstaPay)
 *   3. Cash Wallet — wallet details + copy (شراء بالمحفظة)
 *   4. WhatsApp — wa.me link (راسلنا على واتساب)
 *   5. Official Website — official link (موقع الشركة)
 *
 * Links from DB (main_actions section) — fallback to DEFAULT_ACTION_LINKS.
 */
export function ActionsCards({
  links = DEFAULT_ACTION_LINKS,
  whatsAppNumber,
  whatsAppPreMessage,
  walletDetails,
}: ActionsCardsProps) {
  const mainLinks = links.filter(
    (l) => l.section === "main_actions" && l.enabled,
  )
  const cards = mainLinks.map<ActionCardData>((link) => ({
    icon: ICONS[link.iconKey],
    title: link.title,
    description: link.description,
    href: link.url,
    buttonText: DEFAULT_BUTTONS[link.iconKey] ?? link.title,
  }))

  return (
    <Section className="bg-canvas">
      <SectionTitle
        eyebrow="الإجراءات الأساسية"
        title="إجراءاتنا الإلكترونية"
        description="طرق مباشرة للتواصل معنا وإجراء المعاملات الأساسية"
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <ActionCard key={card.title} {...card} />
        ))}
        {whatsAppNumber ? (
          <WhatsAppCard
            number={whatsAppNumber}
            preMessage={whatsAppPreMessage}
          />
        ) : null}
        {walletDetails ? <WalletCard {...walletDetails} /> : null}
      </div>
    </Section>
  )
}
