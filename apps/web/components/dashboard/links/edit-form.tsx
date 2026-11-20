"use client"

import * as React from "react"
import { X } from "lucide-react"
import { updateLinkAction } from "@/app/(dashboard)/dashboard/links/actions"
import { LINK_ICON_KEYS } from "@/validators/link"
import type { ILinkItem, LinkSection } from "@/types/link"

export function EditForm({
  link,
  onClose,
}: {
  link: ILinkItem
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-xl">
        <button type="button" onClick={onClose} className="absolute start-4 top-4 rounded-lg p-2 text-muted hover:bg-bg">
          <X className="size-5" />
        </button>
        <h3 className="mb-4 text-lg font-bold text-ink">تعديل الرابط</h3>
        <form action={updateLinkAction.bind(null, link.slug)} className="space-y-4">
          <input name="title" defaultValue={link.title} placeholder="العنوان" required className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
          <input name="url" defaultValue={link.url} placeholder="الرابط" required className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
          <input name="description" defaultValue={link.description ?? ""} placeholder="الوصف" className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
          <select name="iconKey" defaultValue={link.iconKey} className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink">
            {LINK_ICON_KEYS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <select name="section" defaultValue={link.section} className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink">
            {(["main_actions", "footer", "navbar"] as LinkSection[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input type="number" name="displayOrder" min={0} defaultValue={link.displayOrder} className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink" />
          <label className="inline-flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="enabled" value="true" defaultChecked={link.enabled} className="size-4 accent-primary" />
            مفعّل
          </label>
          <button type="submit" className="inline-flex h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-hover">
            حفظ
          </button>
          <button type="button" onClick={onClose} className="inline-flex h-11 rounded-lg border border-line px-6 text-sm font-semibold text-ink hover:bg-bg">
            إلغاء
          </button>
        </form>
      </div>
    </div>
  )
}
