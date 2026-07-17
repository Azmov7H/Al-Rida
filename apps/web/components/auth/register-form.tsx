"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { registerAction } from "@/app/(marketing)/login/actions"

function Submit() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "جاري الإنشاء..." : "إنشاء الحساب"}
    </Button>
  )
}

export function RegisterForm({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ error?: string }>
}) {
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    searchParamsPromise.then((p) => {
      const map: Record<string, string> = {
        invalid: "تحقق من صحة البيانات المدخلة.",
        exists: "البريد الإلكتروني مسجل مسبقاً.",
      }
      setError(p.error ? (map[p.error] ?? "تعذر إنشاء الحساب.") : null)
    })
  }, [searchParamsPromise])

  return (
    <form action={registerAction} className="flex flex-col gap-4">
      {error ? (
        <p className="rounded-lg bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">{error}</p>
      ) : null}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">الاسم الكامل</span>
        <input
          name="name"
          required
          placeholder="الاسم"
          className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">البريد الإلكتروني</span>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">كلمة المرور</span>
        <input
          name="password"
          type="password"
          required
          placeholder="8 أحرف على الأقل"
          className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">تأكيد كلمة المرور</span>
        <input
          name="confirmPassword"
          type="password"
          required
          placeholder="••••••••"
          className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        />
      </label>
      <Submit />
    </form>
  )
}
