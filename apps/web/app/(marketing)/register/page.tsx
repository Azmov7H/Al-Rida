import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export const dynamic = "force-dynamic"

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-[#0F3B73]">
            الرضا
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-[#1E293B]">إنشاء حساب</h1>
          <p className="mt-1 text-sm text-[#64748B]">انضم إلى متجر الرضا للأجهزة</p>
        </div>
        <RegisterForm searchParamsPromise={searchParams} />
        <p className="mt-6 text-center text-sm text-[#64748B]">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-medium text-[#0F3B73] hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}
