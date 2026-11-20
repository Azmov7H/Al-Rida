import { brandRepository } from "@/repositories/brand.repository"
import { requireRole } from "@/lib/auth/guard"
import { ok, created, badRequest, serverError } from "@/lib/responses"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  logo: z.string().optional(),
})

export async function GET() {
  try {
    return ok(await brandRepository.list())
  } catch {
    return serverError()
  }
}

export async function POST(request: Request) {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return badRequest(parsed.error.flatten())
  try {
    return created(await brandRepository.create(parsed.data))
  } catch {
    return serverError()
  }
}
