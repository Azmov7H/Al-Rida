import type { LucideIcon } from "lucide-react"
import {
  ShieldCheck,
  BadgeCheck,
  Award,
  Clock,
  Wrench,
  Truck,
} from "lucide-react"

export const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/products" },
  { label: "العلامات التجارية", href: "/brands" },
  { label: "المشاريع", href: "/projects" },
  { label: "العروض", href: "/offers" },
  { label: "من نحن", href: "/about" },
  { label: "اتصل بنا", href: "/contact" },
]

export const trustIndicators = [
  "منتجات أصلية",
  "موزع معتمد",
  "ضمان الجودة",
  "دعم فني",
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
  { name: "اسطوانات", href: "/categories/cylinders", count: 58 },
  { name: "أقفال ذكية", href: "/categories/smart-locks", count: 41 },
  { name: "إكسسوارات الأبواب", href: "/categories/accessories", count: 110 },
]

export const featuredProducts = [
  {
    name: "قفل مورتايس احترافي",
    brand: "Mul-T-Lock",
    sku: "MTL-CM-201",
    availability: "متوفر",
    spec: "ستانلس ستيل · درجة أمان عالية",
  },
  {
    name: "قفل ذكي ببصمة الإصبع",
    brand: "Yale",
    sku: "YAL-SM-440",
    availability: "متوفر",
    spec: "Wi-Fi · بطارية طويلة الأمد",
  },
  {
    name: "وك قبضة ستانلس",
    brand: "Hafele",
    sku: "HAF-HD-118",
    availability: "متوفر",
    spec: "ستانلس 304 · مقاوم للصدأ",
  },
  {
    name: "مفصلة ثقيلة للأبواب",
    brand: "ASSA Abloy",
    sku: "AA-HN-330",
    availability: "متوفر",
    spec: "حمل عالي · استخدام تجاري",
  },
]

export const whyUs: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BadgeCheck,
    title: "موزع معتمد",
    description: "وكيل معتمد للعلامات التجارية العالمية والمحلية.",
  },
  {
    icon: ShieldCheck,
    title: "منتجات أصلية",
    description: "منتجات أصلية بضمان المصنع وشهادات موثقة.",
  },
  {
    icon: Award,
    title: "أفضل العلامات التجارية",
    description: "نوفر منتجات من كبرى شركات الأقفال والأوكر.",
  },
  {
    icon: Clock,
    title: "خبرة طويلة",
    description: "سنوات من الخبرة في السوق المصري لمشاريع متنوعة.",
  },
  {
    icon: Wrench,
    title: "خدمة ما بعد البيع",
    description: "دعم فني وصيانة واحترافية بعد البيع.",
  },
  {
    icon: Truck,
    title: "سرعة التوريد",
    description: "توريد سريع وموثوق لجميع أنحاء الجمهورية.",
  },
]

export const statistics = [
  { label: "سنوات الخبرة", value: 25, suffix: "+" },
  { label: "منتج", value: 2400, suffix: "+" },
  { label: "علامة تجارية", value: 40, suffix: "+" },
  { label: "عميل", value: 18000, suffix: "+" },
  { label: "مشروع منفذ", value: 520, suffix: "+" },
]

export const projects = [
  {
    name: "أبراج النيل",
    location: "القاهرة",
    products: "أقفال مورتايس · أوكر ستانلس",
  },
  {
    name: "فندق رويال",
    location: "الجيزة",
    products: "أقفال ذكية · مفصلات تجارية",
  },
  {
    name: "عيادات مدي كير",
    location: "الإسكندرية",
    products: "أقفال صحية · إكسسوارات",
  },
  {
    name: "مجمع الأعمال",
    location: "القاهرة الجديدة",
    products: "أنظمة تحكم · أوكر",
  },
]

export const testimonials = [
  {
    name: "مهندس عمر حسن",
    company: "مقاول إنشاءات",
    rating: 5,
    review: "مورد موثوق لأدوات الأبواب في مشاريعنا، جودة والتزام بالمواعيد.",
  },
  {
    name: "م. ليلى عادل",
    company: "مصممة داخلية",
    rating: 5,
    review: "الأقفال الذكية واللمسات الاحترافية رفعت جودة مشاريع عملائنا.",
  },
  {
    name: "أ. كريم صالح",
    company: "مدير منشأة",
    rating: 4,
    review: "توريد سريع ودعم فني ممتاز لفنادقنا ومشاريعنا التجارية.",
  },
]

export const footerColumns = [
  {
    title: "الشركة",
    links: ["من نحن", "المشاريع", "الوظائف", "المدونة"],
  },
  {
    title: "المنتجات",
    links: ["الأقفال", "الأوكر", "المفصلات", "الأقفال الذكية"],
  },
  {
    title: "العلامات التجارية",
    links: ["Al Ahram", "Yale", "Kale", "ASSA Abloy"],
  },
  {
    title: "الدعم",
    links: ["الشحن", "الإرجاع", "الضمان", "الأسئلة الشائعة"],
  },
]

export const contactInfo = {
  email: "sales@alreda.com.eg",
  phone: "+20 2 1234 5678",
  address: "القاهرة، جمهورية مصر العربية",
}
