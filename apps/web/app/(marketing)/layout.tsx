import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Al-Reda (الرضا)",
    template: "%s | Al-Reda (الرضا)",
  },
  description:
    "Al-Reda (الرضا) — تجربة رقمية مميزة مع روابط الموقع والدفع والتواصل المباشر.",
  openGraph: {
    title: "Al-Reda (الرضا)",
    description:
      "Al-Reda (الرضا) — تجربة رقمية مميزة مع روابط الموقع والدفع والتواصل المباشر.",
    type: "website",
    locale: "ar_EG",
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
