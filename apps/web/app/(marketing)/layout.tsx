import type { Metadata } from "next"


export const metadata: Metadata = {
  title: {
    default: "الرضا — منصة أوكر الأبواب والأقفال والكوالين",
    template: "%s · الرضا",
  },
  description:
    "خدمة الأبواب والأقفال والكوالين الأصلية — الرضا: منصة رقمية للأعمال اليدوية المحترفة.",
  openGraph: {
    title: "الرضا — منصة أوكر الأبواب والأقفال والكوالين",
    description: "خدمة الأبواب والأقفال والكوالين الأصلية — الرضا: منصة رقمية للأعمال اليدوية المحترفة.",
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "الرضا",
    description: "خدمة الأبواب والأقفال الأصلية — الرضا: منصة رقمية للأعمال اليدوية المحترفة.",
  },
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
 

  return (
    <>

      {children}

    </>
  )
}
