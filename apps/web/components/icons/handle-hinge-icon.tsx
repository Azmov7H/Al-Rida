import type * as React from "react"

/** Custom handle/hinge icon: door handle knob + door body + hinge detail. */
export function HandleHingeIcon({
  size = 24,
  strokeWidth = 2,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }) {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="9.5" r="4" />
      <path d="M6 10c0 4.6 4 6.4 8 6.4s8-1.8 8-6.4" />
      <circle cx="13.5" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
