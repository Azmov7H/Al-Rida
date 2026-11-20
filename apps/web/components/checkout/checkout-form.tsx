"use client"

import * as React from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Image from "next/image"
import { placeOrderAction, type CheckoutState } from "@/app/(marketing)/checkout/actions"
import { readCart, type CartLine } from "@/store/cart"
import { formatCurrency } from "@/lib/utils"

interface CartProduct {
  productId: string
  name: string
  price: number
  salePrice?: number | null
  image: string
}

const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "الشرقية",
  "القليوبية",
  "المنوفية",
  "الغربية",
  "كفر الشيخ",
  "البحيرة",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "الوادي الجديد",
  "مطروح",
  "شمال سيناء",
  "جنوب سيناء",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "دمياط",
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#0F3B73] text-base font-semibold text-white transition-colors hover:bg-[#0C2F5C] disabled:opacity-60"
    >
      {pending ? "جاري إتمام الطلب..." : "تأكيد الطلب"}
    </button>
  )
}

export function CheckoutForm() {
  const [state, formAction] = useActionState<CheckoutState, FormData>(placeOrderAction, {})
  const lines = React.useMemo<CartLine[]>(() => readCart(), [])
  const [products, setProducts] = React.useState<CartProduct[]>([])
  const [loading, setLoading] = React.useState(() => lines.length > 0)
  const [payment, setPayment] = React.useState<"cod" | "paymob" | "stripe">("cod")
  const [shipping, setShipping] = React.useState<"standard" | "express">("standard")

  React.useEffect(() => {
    if (lines.length === 0) return
    let active = true
    Promise.all(
      lines.map(async (l) => {
        const res = await fetch(`/api/products/${l.productId}`)
        if (!res.ok) return null
        const json = await res.json()
        const p = json.data
        return {
          productId: l.productId,
          name: p.name,
          price: p.price,
          salePrice: p.salePrice ?? null,
          image: p.images?.[0]?.url ?? "",
        } as CartProduct
      }),
    ).then((results) => {
      if (!active) return
      setProducts(results.filter(Boolean) as CartProduct[])
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [lines])

  const shippingFee = shipping === "express" ? 80 : 0
  const subtotal = products.reduce(
    (sum, p, i) => sum + (p.salePrice ?? p.price) * (lines[i]?.quantity ?? 0),
    0,
  )
  const total = subtotal + shippingFee

  if (loading) {
    return <p className="text-[#64748B]">جاري تحميل السلة...</p>
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center text-[#64748B]">
        سلة التسوق فارغة.
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="items" value={JSON.stringify(lines)} />
      <input type="hidden" name="paymentMethod" value={payment} />
      <input type="hidden" name="shippingFee" value={String(shippingFee)} />

      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">المنتجات</h2>
        <ul className="flex flex-col gap-3">
          {products.map((p, i) => (
            <li key={p.productId} className="flex items-center gap-3">
              <div className="relative size-14 overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1E293B]">{p.name}</p>
                <p className="text-xs text-[#64748B]">الكمية: {lines[i]?.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-[#1E293B]">
                {formatCurrency((p.salePrice ?? p.price) * (lines[i]?.quantity ?? 0))}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">بيانات الشحن</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="fullName" required placeholder="الاسم الكامل" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
          <input name="phone" required placeholder="رقم الهاتف" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
          <input name="email" type="email" required placeholder="البريد الإلكتروني" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
          <select name="governorate" required className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]">
            <option value="">المحافظة</option>
            {GOVERNORATES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <input name="city" required placeholder="المدينة" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
          <input name="street" required placeholder="العنوان" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
          <input name="postalCode" placeholder="الرقم البريدي (اختياري)" className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]" />
        </div>
      </section>

      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">طريقة الشحن</h2>
        <div className="flex flex-col gap-2">
          {[
            { id: "standard", label: "شحن عادي", fee: 0 },
            { id: "express", label: "شحن سريع", fee: 80 },
          ].map((m) => (
            <label key={m.id} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm">
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping"
                  checked={shipping === m.id}
                  onChange={() => setShipping(m.id as "standard" | "express")}
                  className="size-4 text-[#0F3B73]"
                />
                {m.label}
              </span>
              <span className="text-[#64748B]">{m.fee === 0 ? "مجاني" : formatCurrency(m.fee)}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">طريقة الدفع</h2>
        <div className="flex flex-col gap-2">
          {[
            { id: "cod", label: "الدفع عند الاستلام" },
            { id: "paymob", label: "الدفع الإلكتروني (Paymob)" },
          ].map((m) => (
            <label key={m.id} className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm">
              <input
                type="radio"
                name="payment"
                checked={payment === m.id}
                onChange={() => setPayment(m.id as "cod" | "paymob" | "stripe")}
                className="size-4 text-[#0F3B73]"
              />
              {m.label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E293B]">ملخص الطلب</h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#64748B]">المجموع الفرعي</span>
            <span className="font-medium text-[#1E293B]">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">الشحن</span>
            <span className="font-medium text-[#1E293B]">
              {shippingFee === 0 ? "مجاني" : formatCurrency(shippingFee)}
            </span>
          </div>
          <div className="flex justify-between border-t border-[#E2E8F0] pt-2">
            <span className="font-semibold text-[#1E293B]">الإجمالي</span>
            <span className="text-lg font-bold text-[#0F3B73]">{formatCurrency(total)}</span>
          </div>
        </div>
        <textarea
          name="notes"
          placeholder="ملاحظات (اختياري)"
          rows={3}
          className="mt-4 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        />
      </section>

      {state.error ? (
        <p className="rounded-lg bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">{state.error}</p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
