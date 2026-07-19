"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Save } from "lucide-react"
import { updateContentAction } from "@/app/(dashboard)/dashboard/content/actions"

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0F3B73] px-4 text-sm text-white disabled:opacity-50"
    >
      <Save className="size-4" />
      {pending ? "جاري الحفظ..." : "حفظ"}
    </button>
  )
}

interface Field {
  key: string
  label: string
  multiline?: boolean
}

const FIELD_MAP: Record<string, Field[]> = {
  hero: [
    { key: "badge", label: "الشارة" },
    { key: "title", label: "العنوان", multiline: true },
    { key: "subtitle", label: "الوصف", multiline: true },
    { key: "primaryCta", label: "نص الزر الأول" },
    { key: "primaryCtaHref", label: "رابط الزر الأول" },
    { key: "secondaryCta", label: "نص الزر الثاني" },
    { key: "secondaryCtaHref", label: "رابط الزر الثاني" },
  ],
  company: [
    { key: "name", label: "اسم الشركة" },
    { key: "email", label: "البريد" },
    { key: "phone", label: "الهاتف" },
    { key: "address", label: "العنوان", multiline: true },
  ],
}

function TextField({
  name,
  label,
  defaultValue,
  multiline,
}: {
  name: string
  label: string
  defaultValue: string
  multiline?: boolean
}) {
  if (multiline) {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[#475569]">{label}</span>
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={2}
          className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        />
      </label>
    )
  }
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[#475569]">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      />
    </label>
  )
}

export function ContentEditor({
  section,
  title,
  data,
}: {
  section: string
  title: string
  data: Record<string, unknown>
}) {
  const fields = FIELD_MAP[section] ?? []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const out: Record<string, unknown> = {}
    for (const field of fields) {
      const v = fd.get(`f_${field.key}`) as string
      if (v !== null && v !== "") out[field.key] = v
    }
    const payload = new FormData()
    payload.set("section", section)
    payload.set("data", JSON.stringify(out))
    await updateContentAction(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="section" value={section} />
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1E293B]">{title}</h3>
        <Submit />
      </div>
      {fields.length === 0 ? (
        <p className="text-xs text-[#94A3B8]">هذا القسم يدار من مكان آخر.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <TextField
              key={f.key}
              name={`f_${f.key}`}
              label={f.label}
              defaultValue={(data[f.key] as string) ?? ""}
              multiline={f.multiline}
            />
          ))}
        </div>
      )}
    </form>
  )
}
