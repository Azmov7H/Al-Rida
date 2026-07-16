import Link from "next/link"

export function Cta() {
  return (
    <section className="w-full bg-[#0F3B73] py-16 md:py-20">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-5 text-center md:px-10 lg:px-20">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          ابدأ مشروعك معنا اليوم
        </h2>
        <p className="max-w-xl text-white/80">
          نوفر لك منتجات أصلية وحلولًا احترافية لمشاريعك مهما كان حجمها.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-7 text-base font-semibold text-[#0F3B73] transition-opacity hover:opacity-90"
          >
            تواصل معنا
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-white px-7 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            اطلب عرض سعر
          </Link>
        </div>
      </div>
    </section>
  )
}
