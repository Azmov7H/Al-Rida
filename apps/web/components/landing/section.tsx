import * as React from "react"
import { cn } from "@/lib/utils"

export function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn("w-full px-5 py-16 md:px-10 md:py-20 lg:px-20", className)}
    >
      <div className="mx-auto w-full max-w-[1440px]">{children}</div>
    </section>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "start"
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-start",
      )}
    >
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-widest text-[#F58220]">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-bold text-[#1E293B] md:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-[#64748B]">{description}</p>
      ) : null}
    </div>
  )
}
