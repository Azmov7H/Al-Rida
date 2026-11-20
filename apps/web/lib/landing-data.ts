/**
 * Legacy static landing data — retained as SSR fallbacks and for legacy pages:
 * navLinks (navbar), brands, categories, statistics, projects, contactInfo.
 * Dynamic public data (testimonials, links, company) lives in MongoDB now.
 */

export const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الأقفال", href: "/" },
  { label: "الأوكر", href: "/" },
  { label: "الكوالين", href: "/" },
  { label: "المشاريع", href: "/projects" },
  { label: "العروض", href: "/offers" },
  { label: "من نحن", href: "/about" },
  { label: "العلامات التجارية", href: "/brands" },
  { label: "اتصل بنا", href: "/contact" },
]

export const brands = [
  "Al Ahram",
  "Yale",
  "Kale",
  "ASSA Abloy",
  "Mul-T-Lock",
  "Dormakaba",
  "Hafele",
  "Cisa",
]

export const categories = [
  { name: "كوالين", href: "/categories/cylinders", count: 62 },
  { name: "أوكر", href: "/categories/handles", count: 96 },
  { name: "مفصلات", href: "/categories/hinges", count: 74 },
  { name: "اسطوانات", href: "/categories/coil-springs", count: 58 },
  { name: "أقفال ذكية", href: "/categories/smart-locks", count: 41 },
  { name: "إكسسوارات الأبواب", href: "/categories/accessories", count: 110 },
]

export const statistics = [
  { label: "سنوات الخبرة", value: 25, suffix: "+" },
  { label: "منتج", value: 2400, suffix: "+" },
  { label: "علامة تجارية", value: 40, suffix: "+" },
  { label: "عميل", value: 18000, suffix: "+" },
  { label: "مشروع منفذ", value: 520, suffix: "+" },
]

export const projects = [
  { name: "أبراج النيل", location: "القاهرة", products: "أقفال مورتايس · أوكر ستانلس" },
  { name: "فندق رويال", location: "الجيزة", products: "أقفال ذكية · مفصلات تجارية" },
  { name: "عيادات مدي كير", location: "الإسكندرية", products: "أقفال صحية · إكسسوارات" },
  { name: "مجمع الأعمال", location: "القاهرة الجديدة", products: "أنظمة تحكم · أوكر" },
]

export const contactInfo = {
  email: "sales@alreda.com.eg",
  phone: "+20 2 1234 5678",
  address: "القاهرة، جمهورية مصر العربية",
}
