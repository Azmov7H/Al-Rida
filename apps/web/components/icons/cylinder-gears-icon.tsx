import type * as React from "react"

/** Custom cylinder/gears icon: mechanical lock cylinders with gear teeth. */
export function CylinderGearsIcon({
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
      <ellipse cx="12" cy="8" rx="6" ry="4" />
      <circle cx="12" cy="8" r="2" fill="currentColor" stroke="none" />
      <path d="M8 6.5v2M6 8v3M8 9.5v2" />
      <path d="M16 6.5v2M18 8v3M16 9.5v2" />
      <path d="M6 13v2M5 14.5v3M6 15.5v2" />
      <path d="M18 13v2M19 14.5v3M18 15.5v2" />
    </svg>
  )
}
