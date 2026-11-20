"use client"

import * as React from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { contactAction, type ContactState } from "@/app/(marketing)/contact/actions"

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#0F3B73] text-base font-semibold text-white transition-colors hover:bg-[#0C2F5C] disabled:opacity-60"
    >
      {pending ? "جاري الإرسال..." : "إرسال الرسالة"}
    </button>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(contactAction, {})

  if (state.success) {
    return (
      <div className="rounded-2xl border border-[#16A34A]/30 bg-[#16A34A]/10 p-6 text-center text-[#16A34A]">
        تم استلام رسالتك، سنتواصل معك قريباً.
      </div>
    )
  }

  return (
    <form action={formAction} className="grid gap-4">
      {state.error ? (
        <p className="rounded-lg bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">{state.error}</p>
      ) : null}
      <input
        name="name"
        required
        placeholder="الاسم الكامل"
        className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="البريد الإلكتروني"
        className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder="رسالتك"
        className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      />
      <Submit />
    </form>
  )
}
