import type * as React from "react"

/** Custom door-frame icon: stylized door with arch top inside a square frame. */
export function DoorFrameIcon({
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
      <rect x="4.5" y="4.5" width="15" height="15" rx="2" />
      <path d="M10 17a6 6 0 0 0 4 1.5" />
      <circle cx="12" cy="9" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
