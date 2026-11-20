import * as React from "react"
import { cn } from "@/lib/utils"

type Variant =
  | "primary"
  | "accent"
  | "outline"
  | "ghost"
  | "danger"
  | "success"

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary",
  accent:
    "bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent",
  outline:
    "bg-transparent border border-line text-ink hover:bg-bg focus-visible:ring-primary",
  ghost:
    "bg-transparent text-ink hover:bg-bg focus-visible:ring-primary",
  danger:
    "bg-danger text-white hover:opacity-90 focus-visible:ring-danger",
  success:
    "bg-success text-white hover:opacity-90 focus-visible:ring-success",
}

const sizes: Record<"sm" | "md" | "lg", string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-12 px-7 text-base",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: keyof typeof sizes
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "lg", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"
