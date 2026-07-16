import { Hero } from "@/components/landing/hero"
import { Brands } from "@/components/landing/brands"
import { Categories } from "@/components/landing/categories"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { WhyUs } from "@/components/landing/why-us"
import { CompanyNumbers } from "@/components/landing/company-numbers"
import { Projects } from "@/components/landing/projects"
import { Testimonials } from "@/components/landing/testimonials"
import { Cta } from "@/components/landing/cta"

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Brands />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
      <CompanyNumbers />
      <Projects />
      <Testimonials />
      <Cta />
    </main>
  )
}
