"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportSalesCsvAction } from "@/app/(dashboard)/dashboard/reports/actions"

function Trigger() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="sm" variant="outline" disabled={pending}>
      <Download className="size-4" />
      {pending ? "جاري التصدير..." : "تصدير CSV"}
    </Button>
  )
}

export function ExportSalesButton() {
  async function handleSubmit() {
    const { url } = await exportSalesCsvAction()
    if (!url) return
    const a = document.createElement("a")
    a.href = url
    a.download = `sales-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <form action={handleSubmit}>
      <Trigger />
    </form>
  )
}
