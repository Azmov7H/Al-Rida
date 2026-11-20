import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label className="text-sm font-medium text-ink" htmlFor={props.id}>
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
          className,
        )}
        {...props}
      />
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  ),
)
Input.displayName = "Input"

export { Input as default }
