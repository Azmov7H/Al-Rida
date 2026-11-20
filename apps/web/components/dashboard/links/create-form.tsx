"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { createLinkAction } from "@/app/(dashboard)/dashboard/links/actions"
import { LINK_ICON_KEYS } from "@/validators/link"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-70"
    >
      {pending ? "جارٍ الحفظ…" : "إضافة"}
    </button>
  )
}

export function CreateForm() {
  return (
    <form
      action={async (formData: FormData) => {
        await createLinkAction(formData)
      }}
      className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold text-ink">إضافة رابط جديد</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input name="title" placeholder="العنوان" required className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
        <input name="url" placeholder="الرابط" required className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
        <input name="description" placeholder="الوصف (اختياري)" className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
        <select name="iconKey" className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink">
          {LINK_ICON_KEYS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <select name="section" className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink">
          {["main_actions", "footer", "navbar"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input type="number" name="displayOrder" min={0} defaultValue={0} className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink" placeholder="رقم الترتيب" />
        <label className="inline-flex h-11 items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="enabled" value="true" defaultChecked className="size-4 accent-primary" />
          مفعّل
        </label>
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  )
}
