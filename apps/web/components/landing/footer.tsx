import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { companyService } from "@/services/company.service"
import { linkRepository } from "@/repositories/link.repository"

/** Footer — dynamic links (DB), contact info (Company), brand identity (SSR). */
export async function Footer() {
  const [company, footerLinks] = await Promise.all([
    companyService.getDefault(),
    linkRepository.listBySectionEnabled("footer"),
  ])
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-14 md:px-10 lg:px-20 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-4">
          <p className="text-xl font-bold text-primary">{company.name}</p>
          <p className="max-w-xs text-sm text-muted">{company.description}</p>
          <div className="flex flex-col gap-1.5 text-sm">
            <a
              href={`tel:${company.phone}`}
              className="inline-flex items-center gap-2 text-muted transition-colors hover:text-primary"
            >
              <Phone className="size-4" />
              <span>{company.phone}</span>
            </a>
            <a
              href={`mailto:${company.email}`}
              className="inline-flex items-center gap-2 text-muted transition-colors hover:text-primary"
            >
              <Mail className="size-4" />
              <span>{company.email}</span>
            </a>
            <a
              href={company.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted transition-colors hover:text-primary"
            >
              <MapPin className="size-4" />
              <span>
                {[company.address.street, company.address.city, company.address.governorate, company.address.country].filter(Boolean).join("، ")}
              </span>
            </a>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <h3 className="text-sm font-semibold text-ink">روابط مفيدة</h3>
          <ul className="flex flex-col gap-1.5">
            {footerLinks.map((l) => (
              <li key={l.slug}>
                <a
                  href={l.url}
                  target={l.targetType === "external" ? "_blank" : undefined}
                  rel={l.targetType === "external" ? "noopener noreferrer" : undefined}
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  {l.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-muted md:flex-row md:px-10 lg:px-20">
          <p>© {year} {company.name}. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-primary">
              سياسة الخصوصية
            </Link>
            <Link href="/contact" className="hover:text-primary">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

