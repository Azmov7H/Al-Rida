import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "تأكيد الطلب",
  description: "تم استلام طلبك بنجاح.",
}

export const dynamic = "force-dynamic"

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { order } = await searchParams
  const orderNumber = typeof order === "string" ? order : ""

  return (
    <div className="mx-auto max-w-[640px] px-5 py-16 text-center md:px-10">
      <CheckCircle2 className="mx-auto size-16 text-[#16A34A]" />
      <h1 className="mt-6 text-3xl font-bold text-[#1E293B]">تم استلام طلبك</h1>
      <p className="mt-3 text-[#64748B]">
        شكراً لك. سنرسل تفاصيل الطلب وتأكيد الشحن إلى بريدك الإلكتروني.
      </p>
      {orderNumber ? (
        <p className="mt-4 inline-block rounded-lg bg-[#F8FAFC] px-4 py-2 text-sm text-[#1E293B]">
          رقم الطلب: <span className="font-semibold text-[#0F3B73]">{orderNumber}</span>
        </p>
      ) : null}
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-7 text-base font-semibold text-[#1E293B] transition-colors hover:bg-[#F1F5F9]"
        >
          متابعة التسوق
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-[#0F3B73] px-7 text-base font-semibold text-white transition-colors hover:bg-[#0C2F5C]"
        >
          الصفحة الرئيسية
        </Link>
      </div>
    </div>
  )
}
