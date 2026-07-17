import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const dynamic = "force-dynamic"

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-[#0F3B73]">
            الرضا
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-[#1E293B]">تسجيل الدخول</h1>
          <p className="mt-1 text-sm text-[#64748B]">ادخل إلى حسابك أو لوحة التحكم</p>
        </div>
        <LoginForm searchParamsPromise={searchParams} />
        <p className="mt-6 text-center text-sm text-[#64748B]">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-medium text-[#0F3B73] hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  )
}
