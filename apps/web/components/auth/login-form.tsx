"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { loginAction } from "@/app/(marketing)/login/actions"

function Submit() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "جاري الدخول..." : "دخول"}
    </Button>
  )
}

export function LoginForm({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ redirect?: string; error?: string }>
}) {
  const [params, setParams] = React.useState<{ redirect?: string; error?: string }>({})

  React.useEffect(() => {
    searchParamsPromise.then(setParams)
  }, [searchParamsPromise])

  const errorMap: Record<string, string> = {
    invalid: "بيانات غير صحيحة، تحقق من المدخلات.",
    credentials: "البريد أو كلمة المرور غير صحيحة.",
  }

  return (
    <form action={loginAction} className="flex flex-col gap-4">
      {params.redirect ? (
        <input type="hidden" name="redirect" value={params.redirect} />
      ) : null}
      {params.error ? (
        <p className="rounded-lg bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">
          {errorMap[params.error] ?? "تعذر تسجيل الدخول."}
        </p>
      ) : null}
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
          placeholder="••••••••"
          className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        />
      </label>
      <Submit />
    </form>
  )
}
