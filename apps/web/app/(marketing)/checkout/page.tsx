import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export const metadata: Metadata = {
  title: "الدفع",
  description: "أكمل طلبك بخطوات آمنة وسريعة.",
}

export const dynamic = "force-dynamic"

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <h1 className="mb-8 text-3xl font-bold text-[#1E293B]">إتمام الطلب</h1>
      <CheckoutForm />
    </div>
  )
}
