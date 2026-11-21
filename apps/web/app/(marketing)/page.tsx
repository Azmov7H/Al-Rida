import { ArrowDown, CreditCard, MapPin, MessageCircle, Star } from "lucide-react"
import { DoorAnimation } from "@/components/landing/door-animation"
import { siteData } from "@/src/data/site-data"

export default function LandingPage() {
  const [instaPay1, instaPay2] = siteData.instaPay

  return (
    <DoorAnimation>
      <main className="relative min-h-screen overflow-hidden bg-[#03070d] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_-10%,rgba(245,130,32,0.22),transparent_60%),radial-gradient(700px_360px_at_10%_30%,rgba(15,59,115,0.45),transparent_60%),linear-gradient(180deg,#07111d_0%,#050b14_45%,#03070d_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

        <section id="main" className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-5 pb-16 pt-24 text-center md:px-10 lg:px-16">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white/80 backdrop-blur">
            AWKAR · AL-AHRAM · AL-REDA
          </span>
          <p className="mb-4 text-sm font-medium text-amber-200/90 md:text-base">منتج أوكر من شركة الأهرام في تجربة عرض سينمائية</p>
          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-7xl">
            {siteData.company.name}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            هوية رقمية فاخرة تجمع بين الانطباع الأول القوي والوصول السريع للموقع والدفع والتواصل المباشر.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#actions"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f58220] px-7 py-3.5 text-base font-semibold text-[#08111d] shadow-[0_10px_30px_rgba(245,130,32,0.35)] transition hover:translate-y-[-1px] hover:bg-[#ff973f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f58220] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070d]"
            >
              استكشف الإجراءات <ArrowDown className="size-5" />
            </a>
            <a
              href={siteData.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              تواصل واتساب <MessageCircle className="size-5" />
            </a>
          </div>
        </section>

        <section id="actions" className="relative mx-auto max-w-6xl px-5 pb-20 md:px-10 lg:px-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">إجراءات سريعة</h2>
            <p className="mt-3 text-white/70">الموقع، الدفع، والتواصل — بشكل واضح ومباشر.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur transition hover:border-white/20 hover:bg-white/[0.06] md:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-amber-200/90">الموقع والتقييم</p>
                  <h3 className="mt-2 text-2xl font-bold">Google Maps</h3>
                </div>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#0f3b73]/70 text-white ring-1 ring-white/15">
                  <MapPin className="size-6" />
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/75 md:text-base">
                افتح موقع الشركة على خرائط جوجل بسهولة، وشارِكنا تقييمك وتجربتك مع {siteData.company.name}.
              </p>
              <a
                href={siteData.googleMaps.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#08111d] transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                افتح الموقع وقيّمنا على خرائط جوجل <Star className="size-5 fill-[#f58220] text-[#f58220]" />
              </a>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur md:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-amber-200/90">الدفع الإلكتروني</p>
                  <h3 className="mt-2 text-2xl font-bold">InstaPay</h3>
                </div>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#f58220]/20 text-[#ffd3a8] ring-1 ring-[#f58220]/30">
                  <CreditCard className="size-6" />
                </span>
              </div>
              <div className="grid gap-4">
                {[instaPay1, instaPay2].filter(Boolean).map((account, idx) => (
                  <div key={account.paymentUrl} className="rounded-2xl border border-white/10 bg-[#08111d]/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">{account.label}</p>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80">حساب {idx + 1}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      <span className="text-white/55">InstaPay ID: </span>
                      <span dir="ltr" className="font-mono text-amber-100">{account.instaPayId}</span>
                    </p>
                    <a
                      href={account.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#f58220] px-4 py-2.5 font-semibold text-[#08111d] transition hover:bg-[#ff973f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f58220]"
                    >
                      ادفع عبر {account.label}
                    </a>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f3b73]/40 to-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur lg:col-span-2 md:p-7">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold text-amber-200/90">تواصل مباشر</p>
                  <h3 className="mt-2 text-2xl font-bold">WhatsApp</h3>
                  <p className="mt-3 text-white/75">
                    تواصل معنا مباشرة على واتساب للرد السريع والاستفسارات عبر الرقم <span dir="ltr" className="font-mono text-white">{siteData.whatsapp.phoneNumber}</span>.
                  </p>
                </div>
                <a
                  href={siteData.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 py-3.5 text-base font-bold text-[#052012] shadow-[0_12px_30px_rgba(37,211,102,0.25)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                >
                  بدء محادثة واتساب <MessageCircle className="size-5" />
                </a>
              </div>
            </article>
          </div>
        </section>

        <footer className="relative border-t border-white/10 px-5 py-8 text-center text-sm text-white/55 md:px-10">
          <p>{siteData.company.name} · تجربة رقمية مميزة</p>
        </footer>
      </main>
    </DoorAnimation>
  )
}
