"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, Edit, Eye, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { IconTile } from "@/components/ui/icon-tile"
import { ICONS } from "@/components/dashboard/links/link-icons"
import { EditForm } from "@/components/dashboard/links/edit-form"
import { PreviewModal } from "@/components/dashboard/shared/preview-modal"
import {
  toggleLinkEnabledAction,
  deleteLinkAction,
  reorderLinksAction,
} from "@/app/(dashboard)/dashboard/links/actions"
import type { ILinkItem } from "@/types/link"

export function LinksTable({ initialLinks }: { initialLinks: ILinkItem[] }) {
  const [links, setLinks] = React.useState<ILinkItem[]>(initialLinks)
  const [preview, setPreview] = React.useState<ILinkItem | null>(null)
  const [editing, setEditing] = React.useState<ILinkItem | null>(null)

  const refreshLinks = React.useCallback(async () => {
    const res = await fetch("/api/links")
    if (res.ok) {
      setLinks(((await res.json()) as ILinkItem[]).sort((a, b) => a.displayOrder - b.displayOrder))
    }
  }, [])

  const handleDelete = async (link: ILinkItem) => {
    if (window.confirm(`حذف الرابط "${link.title}"؟`)) {
      await deleteLinkAction(link.slug)
      await refreshLinks()
    }
  }

  const handleToggle = async (link: ILinkItem, enabled: boolean) => {
    await toggleLinkEnabledAction(link.slug, enabled)
    await refreshLinks()
  }

  const handleReorder = async (link: ILinkItem, direction: 1 | -1) => {
    await reorderLinksAction(link.slug, direction)
    await refreshLinks()
  }

  return (
    <>
      <div className="rounded-2xl border border-line bg-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-right text-xs font-semibold uppercase text-muted">
              <th className="p-3">#</th>
              <th className="p-3">العنوان</th>
              <th className="p-3">الأيقونة</th>
              <th className="p-3">القسم</th>
              <th className="p-3">الرابط</th>
              <th className="p-3">الترتيب</th>
              <th className="p-3">الحالة</th>
              <th className="p-3 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {links.map((link, index) => (
              <tr key={link.slug} className="hover:bg-bg/50">
                <td className="p-3 font-mono text-xs text-muted">{index + 1}</td>
                <td className="p-3">
                  <p className="font-semibold text-ink">{link.title}</p>
                  {link.description ? <p className="mt-0.5 text-xs text-muted">{link.description}</p> : null}
                </td>
                <td className="p-3">
                  <IconTile icon={ICONS[link.iconKey] ?? null} />
                </td>
                <td className="p-3 text-muted">{link.section}</td>
                <td className="p-3 font-mono text-xs text-muted" dir="ltr" title={link.url}>{link.url}</td>
                <td className="p-3 text-center text-muted">{link.displayOrder}</td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(link, !link.enabled)}
                    className={cn(
                      "inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold transition-colors",
                      link.enabled
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : "bg-muted/10 text-muted hover:bg-muted/20",
                    )}
                  >
                    {link.enabled ? "مفعّل" : "معطّل"}
                  </button>
                </td>
                <td className="p-3 text-center">
                  <div className="inline-flex items-center gap-1">
                    <button type="button" aria-label="تعديل" onClick={() => setEditing(link)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-ink"><Edit className="size-4" /></button>
                    <button type="button" aria-label="معاينة" onClick={() => setPreview(link)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-ink"><Eye className="size-4" /></button>
                    <button type="button" aria-label="أعلى" onClick={() => handleReorder(link, -1)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-ink"><ArrowUp className="size-4" /></button>
                    <button type="button" aria-label="أقل" onClick={() => handleReorder(link, 1)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-ink"><ArrowDown className="size-4" /></button>
                    <button type="button" aria-label="حذف" onClick={() => handleDelete(link)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-ink"><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {links.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-muted">
                  لا توجد روابط بعد — املأ الاسم أعلاه لإضافة.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {editing ? <EditForm link={editing} onClose={() => setEditing(null)} /> : null}
      {preview ? <PreviewModal link={preview} onClose={() => setPreview(null)} /> : null}
    </>
  )
}
