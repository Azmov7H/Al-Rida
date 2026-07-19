import { connectDB } from "@/lib/db"
import { Order, type IOrder } from "@/models/order"
import { Product, type IProduct } from "@/models/product"

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
