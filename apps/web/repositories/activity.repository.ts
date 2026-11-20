import { connectDB } from "@/lib/db"
import { Activity, type IActivity } from "@/models/activity"

export const activityRepository = {
  async list(limit = 50): Promise<IActivity[]> {
    await connectDB()
    return Activity.find().sort({ createdAt: -1 }).limit(limit).lean()
  },
  async log(entry: {
    actor: string
    actorRole?: string
    action: IActivity["action"]
    entity?: string
    entityId?: string
    message: string
  }): Promise<void> {
    await connectDB()
    await Activity.create(entry)
  },
}
