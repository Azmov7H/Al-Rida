"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC] px-6 text-center">
      <h1 className="text-2xl font-bold text-[#0F3B73]">حدث خطأ غير متوقع</h1>
      <p className="max-w-md text-sm text-[#64748B]">
        نعتذر، حدث خلل أثناء تحميل هذه الصفحة. يمكنك المحاولة مرة أخرى.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-[#0F3B73] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0c2f5c]"
      >
        إعادة المحاولة
      </button>
    </main>
  )
}
