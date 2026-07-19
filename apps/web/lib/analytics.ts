import { connectDB } from "@/lib/db"
import { Order, type IOrder } from "@/models/order"
import { Product, type IProduct } from "@/models/product"
import { User, type IUser } from "@/models/user"
import { categoryRepository } from "@/repositories/category.repository"
import { brandRepository } from "@/repositories/brand.repository"

const LOW_STOCK_THRESHOLD = 5

export interface ReportSummary {
  totalRevenue: number
  paidRevenue: number
  orderCount: number
  averageOrderValue: number
  ordersByStatus: { status: string; count: number }[]
  topProducts: { name: string; sku: string; units: number; revenue: number }[]
  lowStock: { name: string; sku: string; stock: number }[]
  inventoryValue: number
  inventoryCount: number
}

export async function buildReportSummary(): Promise<ReportSummary> {
  await connectDB()
  const [orders, products] = await Promise.all([
    Order.find().lean<IOrder[]>(),
    Product.find().lean<IProduct[]>(),
  ])

  const nonCancelled = orders.filter((o) => o.status !== "cancelled")
  const totalRevenue = nonCancelled.reduce((s, o) => s + o.total, 0)
  const paidRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((s, o) => s + o.total, 0)

  const statusCounts = new Map<string, number>()
  for (const o of orders) {
    statusCounts.set(o.status, (statusCounts.get(o.status) ?? 0) + 1)
  }
  const ordersByStatus = [...statusCounts.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count)

  const productAgg = new Map<string, { name: string; sku: string; units: number; revenue: number }>()
  for (const o of nonCancelled) {
    for (const item of o.items) {
      const key = item.product.toString()
      const cur = productAgg.get(key) ?? {
        name: item.name,
        sku: item.sku,
        units: 0,
        revenue: 0,
      }
      cur.units += item.quantity
      cur.revenue += item.total
      productAgg.set(key, cur)
    }
  }
  const topProducts = [...productAgg.values()]
    .sort((a, b) => b.units - a.units)
    .slice(0, 10)

  const lowStock = products
    .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
    .map((p) => ({ name: p.name, sku: p.sku, stock: p.stock }))
    .sort((a, b) => a.stock - b.stock)

  const inventoryValue = products.reduce((s, p) => s + (p.cost ?? 0) * p.stock, 0)

  return {
    totalRevenue,
    paidRevenue,
    orderCount: orders.length,
    averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
    ordersByStatus,
    topProducts,
    lowStock,
    inventoryValue,
    inventoryCount: products.length,
  }
}

export async function buildSalesCsv(): Promise<string> {
  await connectDB()
  const orders = await Order.find().sort({ createdAt: -1 }).lean<IOrder[]>()
  const header = ["orderNumber", "status", "paymentStatus", "total", "createdAt"]
  const rows = orders.map((o) =>
    [
      o.orderNumber,
      o.status,
      o.paymentStatus,
      o.total.toFixed(2),
      new Date(o.createdAt).toISOString().slice(0, 10),
    ].join(","),
  )
  return [header.join(","), ...rows].join("\n")
}

export interface AnalyticsData {
  salesSeries: { date: string; revenue: number; orders: number }[]
  categoryBreakdown: { name: string; products: number; revenue: number }[]
  brandBreakdown: { name: string; products: number; revenue: number }[]
  customerCount: number
  newCustomers: number
  conversion: { visitors: number; orders: number; rate: number }
}

function dayKey(d: Date): string {
  return new Date(d).toISOString().slice(0, 10)
}

export async function buildAnalytics(): Promise<AnalyticsData> {
  await connectDB()
  const [orders, products, users, categories, brands] = await Promise.all([
    Order.find().lean<IOrder[]>(),
    Product.find().lean<IProduct[]>(),
    User.find().lean<IUser[]>(),
    categoryRepository.list(),
    brandRepository.list(),
  ])

  const nonCancelled = orders.filter((o) => o.status !== "cancelled")

  // Daily sales series (last 14 days)
  const seriesMap = new Map<string, { revenue: number; orders: number }>()
  for (const o of nonCancelled) {
    const key = dayKey(o.createdAt)
    const cur = seriesMap.get(key) ?? { revenue: 0, orders: 0 }
    cur.revenue += o.total
    cur.orders += 1
    seriesMap.set(key, cur)
  }
  const salesSeries = [...seriesMap.entries()]
    .map(([date, v]) => ({ date, revenue: v.revenue, orders: v.orders }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Revenue per product (by units sold)
  const productRevenue = new Map<string, number>()
  for (const o of nonCancelled) {
    for (const item of o.items) {
      const key = item.product.toString()
      productRevenue.set(key, (productRevenue.get(key) ?? 0) + item.total)
    }
  }

  const categoryMap = new Map(categories.map((c) => [c._id?.toString(), c.name]))
  const brandMap = new Map(brands.map((b) => [b._id?.toString(), b.name]))

  const categoryAgg = new Map<string, { products: number; revenue: number }>()
  const brandAgg = new Map<string, { products: number; revenue: number }>()
  for (const p of products) {
    const catKey = p.category?.toString() ?? "unknown"
    const brKey = p.brand?.toString() ?? "unknown"
    const rev = productRevenue.get(p._id.toString()) ?? 0

    const cat = categoryAgg.get(catKey) ?? { products: 0, revenue: 0 }
    cat.products += 1
    cat.revenue += rev
    categoryAgg.set(catKey, cat)

    const br = brandAgg.get(brKey) ?? { products: 0, revenue: 0 }
    br.products += 1
    br.revenue += rev
    brandAgg.set(brKey, br)
  }

  const categoryBreakdown = [...categoryAgg.entries()]
    .map(([id, v]) => ({
      name: categoryMap.get(id) ?? "غير مصنف",
      products: v.products,
      revenue: v.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
  const brandBreakdown = [...brandAgg.entries()]
    .map(([id, v]) => ({
      name: brandMap.get(id) ?? "غير مصنف",
      products: v.products,
      revenue: v.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)

  const now = Date.now()
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  const newCustomers = users.filter(
    (u) => new Date(u.createdAt).getTime() >= thirtyDaysAgo,
  ).length

  // Conversion is a simple proxy: orders / (customers assumed as sessions proxy).
  // Without a visits store we estimate visitors as max(customers, orders)*K.
  const visitorProxy = Math.max(users.length, nonCancelled.length) * 3 || 1
  const conversion = {
    visitors: visitorProxy,
    orders: nonCancelled.length,
    rate: nonCancelled.length / visitorProxy,
  }

  return {
    salesSeries,
    categoryBreakdown: categoryBreakdown.map((c) => ({
      name: c.name,
      products: c.products,
      revenue: c.revenue,
    })),
    brandBreakdown: brandBreakdown.map((b) => ({
      name: b.name,
      products: b.products,
      revenue: b.revenue,
    })),
    customerCount: users.length,
    newCustomers,
    conversion,
  }
}
