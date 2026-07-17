import { connectDB } from "@/lib/db"
import { Order, type IOrder } from "@/models/order"

export const orderRepository = {
  async findById(id: string): Promise<IOrder | null> {
    await connectDB()
    return Order.findById(id).lean()
  },

  async findByUser(userId: string, page = 1, limit = 20) {
    await connectDB()
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments({ user: userId }),
    ])
    return { items, total, page, limit }
  },

  async create(data: Partial<IOrder>): Promise<IOrder> {
    await connectDB()
    return Order.create(data)
  },

  async updateStatus(
    id: string,
    status: IOrder["status"],
    actor: IOrder["timeline"][number]["actor"] = "system",
    note?: string,
  ): Promise<IOrder | null> {
    await connectDB()
    return Order.findByIdAndUpdate(
      id,
      {
        $set: { status },
        $push: { timeline: { status, actor, note, timestamp: new Date() } },
      },
      { new: true },
    ).lean()
  },

  async findByOrderNumber(orderNumber: string): Promise<IOrder | null> {
    await connectDB()
    return Order.findOne({ orderNumber }).lean()
  },

  async markPaid(orderNumber: string): Promise<IOrder | null> {
    await connectDB()
    return Order.findOneAndUpdate(
      { orderNumber },
      {
        $set: { paymentStatus: "paid", status: "confirmed" },
        $push: {
          timeline: {
            status: "confirmed",
            actor: "system",
            timestamp: new Date(),
          },
        },
      },
      { new: true },
    ).lean()
  },

  async updateFields(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
    await connectDB()
    return Order.findByIdAndUpdate(id, data, { new: true }).lean()
  },

  async remove(id: string): Promise<void> {
    await connectDB()
    await Order.findByIdAndDelete(id)
  },
}
