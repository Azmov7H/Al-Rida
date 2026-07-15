import { orderRepository } from "@/repositories/order.repository"
import { productRepository } from "@/repositories/product.repository"
import type { CheckoutInput } from "@/validators/order"

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

    return order
  },
}

function generateOrderNumber(): string {
  return `AR-${Date.now().toString(36).toUpperCase()}`
}
