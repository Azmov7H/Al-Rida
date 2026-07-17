import { readFileSync } from "node:fs"
import { connectDB, mongoose } from "@/lib/db"
import { Brand } from "@/models/brand"
import { Category } from "@/models/category"
import { Product } from "@/models/product"
import { productImages } from "@/lib/images"

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const i = line.indexOf("=")
  if (i > 0 && !line.startsWith("#")) {
    const key = line.slice(0, i).trim()
    const val = line.slice(i + 1).trim().replace(/^"|"$/g, "")
    if (!(key in process.env)) process.env[key] = val
  }
}

const BRANDS = [
  { name: "Mul-T-Lock", slug: "mul-t-lock" },
  { name: "Yale", slug: "yale" },
  { name: "Hafele", slug: "hafele" },
  { name: "ASSA Abloy", slug: "assa-abloy" },
  { name: "Al Ahram", slug: "al-ahram" },
  { name: "Kale", slug: "kale" },
]

const CATEGORIES = [
  { name: "كوالين", slug: "cylinders" },
  { name: "أوكر", slug: "handles" },
  { name: "مفصلات", slug: "hinges" },
  { name: "اسطوانات", slug: "cylinders-2" },
  { name: "أقفال ذكية", slug: "smart-locks" },
  { name: "إكسسوارات الأبواب", slug: "accessories" },
]

interface SeedProduct {
  name: string
  brand: string
  category: string
  sku: string
  price: number
  salePrice?: number
  stock: number
  material: string
  finish: string
  securityLevel: string
  country: string
  warranty: string
  tags: string[]
  specifications: { key: string; value: string }[]
}

const PRODUCTS: SeedProduct[] = [
  {
    name: "قفل مورتايس احترافي",
    brand: "Mul-T-Lock",
    category: "أقفال ذكية",
    sku: "MTL-CM-201",
    price: 1250,
    salePrice: 1100,
    stock: 42,
    material: "ستانلس ستيل",
    finish: "مطفي",
    securityLevel: "عالي",
    country: "إسرائيل",
    warranty: "5 سنوات",
    tags: ["قفل", "مورتايس"],
    specifications: [
      { key: "المادة", value: "ستانلس ستيل 304" },
      { key: "درجة الأمان", value: "عالية" },
      { key: "عدد المفاتيح", value: "3" },
    ],
  },
  {
    name: "قفل ذكي ببصمة الإصبع",
    brand: "Yale",
    category: "أقفال ذكية",
    sku: "YAL-SM-440",
    price: 3200,
    salePrice: 2950,
    stock: 18,
    material: "ألومنيوم",
    finish: "فضي",
    securityLevel: "عالي",
    country: "الولايات المتحدة",
    warranty: "3 سنوات",
    tags: ["قفل ذكي", "بصمة"],
    specifications: [
      { key: "الاتصال", value: "Wi-Fi / Bluetooth" },
      { key: "البطارية", value: "4 أشهر" },
      { key: "طرق الفتح", value: "بصمة، رمز، مفتاح" },
    ],
  },
  {
    name: "وك قبضة ستانلس",
    brand: "Hafele",
    category: "أوكر",
    sku: "HAF-HD-118",
    price: 340,
    stock: 120,
    material: "ستانلس ستيل",
    finish: "لامع",
    securityLevel: "متوسط",
    country: "ألمانيا",
    warranty: "سنتان",
    tags: ["وك", "قبضة"],
    specifications: [
      { key: "المادة", value: "ستانلس 304" },
      { key: "مقاوم للصدأ", value: "نعم" },
    ],
  },
  {
    name: "مفصلة ثقيلة للأبواب",
    brand: "ASSA Abloy",
    category: "مفصلات",
    sku: "AA-HN-330",
    price: 180,
    stock: 200,
    material: "حديد مطلي",
    finish: "مطلي",
    securityLevel: "متوسط",
    country: "السويد",
    warranty: "سنتان",
    tags: ["مفصلة"],
    specifications: [
      { key: "الحمل الأقصى", value: "80 كجم" },
      { key: "الاستخدام", value: "تجاري" },
    ],
  },
  {
    name: "اسطوانة قفل قابلة للبرمجة",
    brand: "Kale",
    category: "اسطوانات",
    sku: "KAL-CY-512",
    price: 420,
    salePrice: 380,
    stock: 65,
    material: "نحاس",
    finish: "مطلي",
    securityLevel: "عالي",
    country: "تركيا",
    warranty: "3 سنوات",
    tags: ["اسطوانة"],
    specifications: [
      { key: "المادة", value: "نحاس" },
      { key: "مقاومة للكسر", value: "نعم" },
    ],
  },
  {
    name: "كوالين باب مقاوم للانكسار",
    brand: "Al Ahram",
    category: "كوالين",
    sku: "ALA-CL-090",
    price: 260,
    stock: 90,
    material: "حديد",
    finish: "مطلي",
    securityLevel: "عالي",
    country: "مصر",
    warranty: "5 سنوات",
    tags: ["كوالين"],
    specifications: [
      { key: "المنشأ", value: "مصر" },
      { key: "مقاومة للانكسار", value: "نعم" },
    ],
  },
  {
    name: "قفل درج مخفي",
    brand: "Yale",
    category: "إكسسوارات الأبواب",
    sku: "YAL-AC-221",
    price: 150,
    stock: 140,
    material: "زنك",
    finish: "فضي",
    securityLevel: "متوسط",
    country: "الولايات المتحدة",
    warranty: "سنتان",
    tags: ["قفل", "درج"],
    specifications: [{ key: "النوع", value: "مخفي" }],
  },
  {
    name: "وك فرنساوي أنيق",
    brand: "Hafele",
    category: "أوكر",
    sku: "HAF-HD-205",
    price: 480,
    salePrice: 430,
    stock: 55,
    material: "ستانلس ستيل",
    finish: "مطفي",
    securityLevel: "متوسط",
    country: "ألمانيا",
    warranty: "سنتان",
    tags: ["وك"],
    specifications: [{ key: "التصميم", value: "فرنسي" }],
  },
  {
    name: "مفصلة مخفية للأبواب",
    brand: "ASSA Abloy",
    category: "مفصلات",
    sku: "AA-HN-412",
    price: 320,
    stock: 70,
    material: "ستانلس ستيل",
    finish: "مطفي",
    securityLevel: "عالي",
    country: "السويد",
    warranty: "3 سنوات",
    tags: ["مفصلة", "مخفية"],
    specifications: [{ key: "النوع", value: "مخفية" }],
  },
  {
    name: "اسطوانة ذكية متصلة",
    brand: "Mul-T-Lock",
    category: "اسطوانات",
    sku: "MTL-CY-770",
    price: 980,
    salePrice: 890,
    stock: 30,
    material: "نحاس",
    finish: "فضي",
    securityLevel: "عالي",
    country: "إسرائيل",
    warranty: "5 سنوات",
    tags: ["اسطوانة", "ذكية"],
    specifications: [{ key: "الاتصال", value: "تطبيق" }],
  },
  {
    name: "كوالين فولاذي تجاري",
    brand: "Al Ahram",
    category: "كوالين",
    sku: "ALA-CL-140",
    price: 340,
    stock: 60,
    material: "فولاذ",
    finish: "مطلي",
    securityLevel: "عالي",
    country: "مصر",
    warranty: "7 سنوات",
    tags: ["كوالين"],
    specifications: [{ key: "الاستخدام", value: "تجاري" }],
  },
  {
    name: "إكسسوار تركيب الأبواب",
    brand: "Kale",
    category: "إكسسوارات الأبواب",
    sku: "KAL-AC-330",
    price: 90,
    stock: 300,
    material: "بلاستيك + معدن",
    finish: "متنوع",
    securityLevel: "منخفض",
    country: "تركيا",
    warranty: "سنة",
    tags: ["إكسسوار"],
    specifications: [{ key: "المحتوى", value: "طقم تركيب" }],
  },
]

async function seed() {
  await connectDB()

  await Brand.deleteMany({})
  await Category.deleteMany({})
  await Product.deleteMany({})

  const brandDocs = await Brand.insertMany(BRANDS)
  const brandMap = new Map(brandDocs.map((b) => [b.name, b._id]))

  const categoryDocs = await Category.insertMany(CATEGORIES)
  const categoryMap = new Map(categoryDocs.map((c) => [c.name, c._id]))

  const products = PRODUCTS.map((p, i) => ({
    name: p.name,
    slug: `${p.sku.toLowerCase()}-${i}`,
    sku: p.sku,
    brand: brandMap.get(p.brand),
    category: categoryMap.get(p.category),
    price: p.price,
    salePrice: p.salePrice,
    stock: p.stock,
    material: p.material,
    finish: p.finish,
    securityLevel: p.securityLevel,
    country: p.country,
    warranty: p.warranty,
    tags: p.tags,
    specifications: p.specifications,
    images: [productImages[i % productImages.length]].map((url) => ({
      url,
      alt: p.name,
    })),
    status: "active" as const,
  }))

  await Product.insertMany(products)

  console.log(`Seeded ${products.length} products, ${BRANDS.length} brands, ${CATEGORIES.length} categories.`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
