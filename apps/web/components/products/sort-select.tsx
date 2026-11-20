"use client"

import * as React from "react"

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل للأعلى" },
  { value: "price_desc", label: "السعر: من الأعلى للأقل" },
  { value: "name", label: "الاسم (أ–ي)" },
]

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <>
      <label htmlFor="sort" className="text-sm text-[#64748B]">
        ترتيب:
      </label>
      <select
        id="sort"
        name="sort"
        defaultValue={defaultValue}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </>
  )
}
