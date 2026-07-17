"use server"

import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
})

export interface ContactState {
  success?: boolean
  error?: string
}

export async function contactAction(
  _state: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  })
  if (!parsed.success) {
    return { error: "يرجى التحقق من البيانات المدخلة." }
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/contact`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      },
    )
    if (!res.ok) return { error: "تعذر إرسال الرسالة، حاول مرة أخرى." }
    return { success: true }
  } catch {
    return { error: "تعذر إرسال الرسالة، حاول مرة أخرى." }
  }
}
