import * as React from "react"
import { cn } from "@/lib/utils"

export type IconTileTone = "primary" | "muted" | "danger" | "success"

export interface IconTileProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: React.ReactNode
  tone?: IconTileTone
  size?: "sm" | "md" | "lg"
}

const tones: Record<IconTileTone, string> = {
  primary: "text-primary bg-primary/5 ring-1 ring-primary/10",
  muted: "text-muted bg-bg ring-1 ring-line",
  danger: "text-danger bg-danger/5 ring-1 ring-danger/10",
  success: "text-success bg-success/5 ring-1 ring-success/10",
}

const sizes: Record<NonNullable<IconTileProps["size"]>, string> = {
  sm: "size-9 rounded-xl",
  md: "size-11 rounded-xl",
  lg: "size-[52px] rounded-xl",
}

/** Icon tile: colored icon container, 4px base radius + 2 = 6px/8px/10px radius. */
export const IconTile = React.forwardRef<HTMLSpanElement, IconTileProps>(
  ({ className, icon, tone = "muted", size = "md", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center",
        sizes[size],
        tones[tone],
        className,
      )}
      {...props}
    >
      {icon}
    </span>
  ),
)
IconTile.displayName = "IconTile"

export { IconTile as default }
