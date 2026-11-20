import * as React from "react"
import { cn } from "@/lib/utils"

export type BadgeVariant = "primary" | "success" | "danger" | "muted" | "outline"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary ring-1 ring-primary/10",
  success: "bg-success/10 text-success ring-1 ring-success/10",
  danger: "bg-danger/10 text-danger ring-1 ring-danger/10",
  muted: "bg-bg text-muted ring-1 ring-line",
  outline: "bg-transparent text-ink ring-1 ring-line",
}

/** Small label — `trusted`: موزع معتمد، `certified`: منتج أصلي. */
export function Badge({ variant = "muted", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge as default }
