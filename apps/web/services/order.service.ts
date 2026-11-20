import { orderRepository } from "@/repositories/order.repository"
import { productRepository } from "@/repositories/product.repository"
import { userRepository } from "@/repositories/user.repository"
import { logActivity } from "@/lib/activity"
import type { CheckoutInput } from "@/validators/order"
import type { IAddress } from "@/models/address"
import type { IProduct } from "@/models/product"

export const orderService = {
  async listForUser(userId: string, page = 1, limit = 20) {
    return orderRepository.findByUser(userId, page, limit)
  },

  async checkout(userId: string, input: CheckoutInput) {
    const items = []
    let subtotal = 0

    for (const line of input.items) {
      const product = await productRepository.findById(line.productId)
      if (!product) {
        throw new Error(`Product not found: ${line.productId}`)
      }
      if (product.stock < line.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`)
      }
      const price = product.salePrice ?? product.price
      const total = price * line.quantity
      subtotal += total
      items.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price,
        quantity: line.quantity,
        total,
      })
    }

    const shippingFee = 0
    const discount = 0
    const tax = 0
    const total = subtotal - discount + shippingFee + tax

    const order = await orderRepository.create({
      orderNumber: generateOrderNumber(),
      user: userId as unknown as import("mongoose").Types.ObjectId,
      items,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      status: "pending",
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "cod" ? "unpaid" : "unpaid",
      shippingAddress: input.shippingAddressId as unknown as import("mongoose").Types.ObjectId,
      notes: input.notes,
      timeline: [{ status: "pending", actor: "customer", timestamp: new Date() }],
    })

    for (const line of input.items) {
      await productRepository.decrementStock(line.productId, line.quantity)
    }

    void logActivity({
      actor: userId,
      actorRole: "customer",
      action: "order.created",
      entity: "order",
      entityId: order._id?.toString(),
      message: `طلب جديد رقم ${order.orderNumber} بقيمة ${order.total}`,
    })

    return order
  },

  async placeGuestOrder(input: {
    items: { productId: string; quantity: number }[]
    address: {
      fullName: string
      phone: string
      governorate: string
      city: string
      street: string
      postalCode?: string
      email: string
    }
    paymentMethod: "cod" | "paymob" | "stripe"
    shippingFee?: number
    notes?: string
  }) {
    const { Address } = await import("@/models/address")
    const { connectDB } = await import("@/lib/db")
    await connectDB()

    // Resolve or create a guest user by email.
    const user = await userRepository.findOrCreateGuest(
      input.address.email,
      input.address.fullName,
    )

    // Create the shipping address for this order.
    const address = (await Address.create({
      user: user._id,
      fullName: input.address.fullName,
      phone: input.address.phone,
      governorate: input.address.governorate,
      city: input.address.city,
      street: input.address.street,
      postalCode: input.address.postalCode,
      isDefault: false,
    })) as IAddress

    // Validate stock and compute totals server-side.
    const orderItems: {
      product: import("mongoose").Types.ObjectId
      name: string
      sku: string
      price: number
      quantity: number
      total: number
    }[] = []
    let subtotal = 0

    for (const line of input.items) {
      const product = (await productRepository.findById(
        line.productId,
      )) as IProduct | null
      if (!product) {
        throw new Error(`Product not found: ${line.productId}`)
      }
      if (product.stock < line.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`)
      }
      const price = product.salePrice ?? product.price
      const total = price * line.quantity
      subtotal += total
      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price,
        quantity: line.quantity,
        total,
      })
    }

    const shippingFee = input.shippingFee ?? 0
    const discount = 0
    const tax = 0
    const total = subtotal - discount + shippingFee + tax

    const order = await orderRepository.create({
      orderNumber: generateOrderNumber(),
      user: user._id,
      items: orderItems,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      status: "pending",
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "cod" ? "unpaid" : "unpaid",
      shippingAddress: address._id,
      notes: input.notes,
      timeline: [{ status: "pending", actor: "customer", timestamp: new Date() }],
    })

    for (const line of input.items) {
      await productRepository.decrementStock(line.productId, line.quantity)
    }

    void logActivity({
      actor: user.email,
      actorRole: "customer",
      action: "order.created",
      entity: "order",
      entityId: order._id?.toString(),
      message: `طلب جديد (زائر) رقم ${order.orderNumber} بقيمة ${order.total}`,
    })

    return order
  },
}

function generateOrderNumber(): string {
  return `AR-${Date.now().toString(36).toUpperCase()}`
}
