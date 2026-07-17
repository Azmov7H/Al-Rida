import * as React from "react"
import { Inbox } from "lucide-react"

export function EmptyState({
  title = "لا توجد بيانات",
  description,
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white px-6 py-12 text-center">
      <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-[#F1F5F9] text-[#94A3B8]">
        <Inbox className="size-6" />
      </span>
      <p className="text-sm font-medium text-[#1E293B]">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-xs text-[#94A3B8]">{description}</p>
      ) : null}
    </div>
  )
}
