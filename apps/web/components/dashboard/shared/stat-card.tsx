import * as React from "react"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "blue",
}: {
  label: string
  value: string | number
  hint?: string
  icon?: React.ComponentType<{ className?: string }>
  accent?: "blue" | "orange" | "green" | "red" | "yellow"
}) {
  const accents: Record<string, string> = {
    blue: "bg-[#0F3B73]/10 text-[#0F3B73]",
    orange: "bg-[#F58220]/10 text-[#F58220]",
    green: "bg-[#16A34A]/10 text-[#16A34A]",
    red: "bg-[#DC2626]/10 text-[#DC2626]",
    yellow: "bg-[#CA8A04]/10 text-[#CA8A04]",
  }
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#64748B]">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[#1E293B]">{value}</p>
          {hint ? <p className="mt-1 text-xs text-[#94A3B8]">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className={cn("inline-flex size-11 items-center justify-center rounded-xl", accents[accent])}>
            <Icon className="size-6" />
          </span>
        ) : null}
      </div>
    </div>
  )
}
