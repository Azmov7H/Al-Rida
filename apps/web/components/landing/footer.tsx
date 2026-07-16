import Link from "next/link"
import { footerColumns, contactInfo } from "@/lib/landing-data"

export function Footer() {
  return (
    <footer className="w-full border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 md:grid-cols-2 md:px-10 lg:grid-cols-6 lg:px-20">
        <div className="lg:col-span-2">
          <p className="text-xl font-bold text-[#0F3B73]">الرضا</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#64748B]">
            موزع معتمد لأدوات الأبواب والأقفال في مصر، نخدم العملاء والمقاولين
            والم architects والمشاريع منذ عقود.
          </p>
          <div className="mt-4 space-y-1 text-sm text-[#64748B]">
            <p>{contactInfo.phone}</p>
            <p>{contactInfo.email}</p>
            <p>{contactInfo.address}</p>
          </div>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-[#1E293B]">{col.title}</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-[#64748B] transition-colors hover:text-[#0F3B73]"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E2E8F0]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-[#64748B] md:flex-row md:px-10 lg:px-20">
          <p>© {new Date().getFullYear()} شركة الرضا. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#0F3B73]">
              سياسة الخصوصية
            </Link>
            <Link href="#" className="hover:text-[#0F3B73]">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
