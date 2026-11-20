import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-[#64748B]">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Link href={action.href}>
          <Button size="md">{action.label}</Button>
        </Link>
      ) : null}
    </div>
  )
}
