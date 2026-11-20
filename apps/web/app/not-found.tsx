import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC] px-6 text-center">
      <p className="text-sm font-medium text-[#F58220]">404</p>
      <h1 className="text-2xl font-bold text-[#0F3B73]">الصفحة غير موجودة</h1>
      <p className="max-w-md text-sm text-[#64748B]">
        عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[#0F3B73] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0c2f5c]"
      >
        العودة للرئيسية
      </Link>
    </main>
  )
}
