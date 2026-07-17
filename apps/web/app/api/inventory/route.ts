import { productRepository } from "@/repositories/product.repository"
import { requireRole } from "@/lib/auth/guard"
import { ok, serverError } from "@/lib/responses"

export async function GET() {
  const guard = await requireRole("manager")
  if ("response" in guard) return guard.response
  try {
    return ok(await productRepository.list({ status: "active" }, 1, 100))
  } catch {
    return serverError()
  }
}
