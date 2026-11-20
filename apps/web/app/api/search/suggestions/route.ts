import { ok } from "@/lib/responses"

export async function GET() {
  // TODO: return instant suggestions from Atlas Search.
  return ok([], "Suggestions (pending search index).")
}
