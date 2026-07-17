import * as React from "react"
import { cn } from "@/lib/utils"

type Tone = "gray" | "green" | "blue" | "orange" | "red" | "yellow"

const tones: Record<Tone, string> = {
  gray: "bg-[#F1F5F9] text-[#475569]",
  green: "bg-[#16A34A]/10 text-[#16A34A]",
  blue: "bg-[#0F3B73]/10 text-[#0F3B73]",
  orange: "bg-[#F58220]/10 text-[#F58220]",
  red: "bg-[#DC2626]/10 text-[#DC2626]",
  yellow: "bg-[#CA8A04]/10 text-[#CA8A04]",
}

export function Badge({
  children,
  tone = "gray",
  className,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
