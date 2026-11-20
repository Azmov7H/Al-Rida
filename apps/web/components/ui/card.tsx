import * as React from "react"
import { cn } from "@/lib/utils"

/** Standard card: surface, thin line border, radius-2xl, shadow-sm, hover states. */
export type CardProps = React.HTMLAttributes<HTMLDivElement>

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-sm transition-shadow duration-200 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
Card.displayName = "Card"

/** Elevated card: floating, stronger shadow. */
export function ElevatedCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Card className={cn("shadow-lg", className)} {...props} />
}

/** Flat card: no border, no background (for content that's its own theme). */
export function FlatCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />
}

export { Card as default }
