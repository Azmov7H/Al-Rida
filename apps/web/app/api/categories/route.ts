import { categoryRepository } from "@/repositories/category.repository"
import { requireRole } from "@/lib/auth/guard"
import { ok, created, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  image: z.string().optional(),
  parent: z.string().optional(),
})

export async function GET() {
  try {
    return ok(await categoryRepository.list())
  } catch {
    return serverError()
  }
}

export async function POST(request: Request) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    return created(await categoryRepository.create(parsed.data))
  } catch {
    return serverError()
  }
}
