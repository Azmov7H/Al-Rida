import type * as React from "react"

/** Custom key/slot icon: cylindrical key with door key slot (كوالين + قفل). */
export function KeySlotIcon({
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
      <circle cx="9" cy="10.5" r="3" />
      <path d="M9 13.5v4" />
      <rect x="3" y="18" width="12" height="2" rx="1" />
    </svg>
  )
}
