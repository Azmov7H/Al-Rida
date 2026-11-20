import { DoorAnimation } from "@/components/landing/door-animation"
import { BrandHeader } from "@/components/landing/brand-header"
import { ActionsCards } from "@/components/landing/actions-cards"
import { Testimonials } from "@/components/landing/testimonials"
import { TrustTiles } from "@/components/landing/trust-tiles"
import { ContactTiles } from "@/components/landing/contact-tiles"
import { Footer } from "@/components/landing/footer"
import { connectDB } from "@/lib/db"
import { companyService } from "@/services/company.service"
import { linkRepository } from "@/repositories/link.repository"
import { testimonialRepository } from "@/repositories/testimonial.repository"

export const dynamic = "force-dynamic"

export default async function LandingPage() {
  await connectDB()
  const [company, links, testimonials] = await Promise.all([
    companyService.getDefault(),
    linkRepository.listBySectionEnabled("main_actions"),
    testimonialRepository.getPublishedVerified(),
  ])

  const walletDetails = {
    number: company.cashWalletNumber,
    label: company.cashWalletLabel,
    instructions: company.cashWalletInstructions,
  }

  return (
    <DoorAnimation>
      <main className="flex flex-col gap-12 md:gap-16">
        <BrandHeader
          tagline="حلول مثلية لأوكر الأبواب والأقفال"
          name="الرضا"
          description={company.description}
          websiteUrl={company.websiteUrl}
          coverImageUrl={company.coverImageUrl}
        />
        <ActionsCards
          links={links}
          whatsAppNumber={company.whatsappNumber}
          whatsAppPreMessage={company.whatsappPreMessage}
          walletDetails={walletDetails}
        />
        <Testimonials testimonials={testimonials} />
        <TrustTiles />
        <ContactTiles company={company} />
      </main>
      <Footer />
    </DoorAnimation>
  )
}
