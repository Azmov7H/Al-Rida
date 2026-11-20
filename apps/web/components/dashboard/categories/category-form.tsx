"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"
import { QrScanner } from "@/components/dashboard/products/qr-scanner"
import { generateSku } from "@/lib/utils"

function Submit() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} size="md">
      {pending ? "جاري الحفظ..." : "إنشاء"}
    </Button>
  )
}

export function CategoryForm({
  items,
  formAction,
}: {
  items: { _id?: string; name: string }[]
  formAction: (formData: FormData) => void
}) {
  const codeRef = React.useRef<HTMLInputElement>(null)

  function onCodeDetected(value: string) {
    if (codeRef.current) codeRef.current.value = value
  }

  function generate() {
    if (codeRef.current) codeRef.current.value = generateSku("CAT")
  }

  return (
    <form action={formAction} className="grid gap-3">
      <input
        name="name"
        required
        placeholder="الاسم"
        className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      />
      <input
        name="slug"
        placeholder="الرابط (اختياري)"
        className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">الكود المرجعي</span>
        <div className="flex gap-2">
          <input
            ref={codeRef}
            name="code"
            placeholder="CAT-..."
            className="h-11 flex-1 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-11 items-center gap-1 rounded-lg border border-[#E2E8F0] px-3 text-sm text-[#475569] hover:border-[#0F3B73]"
          >
            <Shuffle className="size-4" /> عشوائي
          </button>
          <QrScanner onDetect={onCodeDetected} />
        </div>
      </div>
      <input
        name="image"
        placeholder="رابط الصورة (اختياري)"
        className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      />
      {items.length > 0 ? (
        <select
          name="parent"
          className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        >
          <option value="">فئة رئيسية</option>
          {items.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      ) : null}
      <Submit />
    </form>
  )
}
