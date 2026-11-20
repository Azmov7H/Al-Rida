import * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "outline" | "ghost"
type Size = "sm" | "md" | "lg"

const variants: Record<Variant, string> = {
  primary: "bg-[#0F3B73] text-white hover:bg-[#0C2F5C] focus-visible:ring-[#0F3B73]",
  secondary:
    "bg-[#F58220] text-white hover:bg-[#DB6F12] focus-visible:ring-[#F58220]",
  outline:
    "border border-[#E2E8F0] bg-transparent text-[#1E293B] hover:bg-[#F8FAFC] focus-visible:ring-[#0F3B73]",
  ghost:
    "bg-transparent text-[#1E293B] hover:bg-[#F1F5F9] focus-visible:ring-[#0F3B73]",
}

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-12 px-7 text-base",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
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
