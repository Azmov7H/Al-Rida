import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  label: string
  tone?: "primary" | "muted"
}

/** Large stat: big Arabic number + label (design: "Business in Numbers" pattern). */
export function StatCard({ value, label, tone = "primary", className, ...props }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface px-5 py-6 text-center shadow-sm",
        className,
      )}
      {...props}
    >
      <p
        className={cn(
          "text-4xl font-bold leading-none",
          tone === "primary" ? "text-primary" : "text-ink",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-xs font-medium text-muted">{label}</p>
    </div>
  )
}

export { StatCard as default }
