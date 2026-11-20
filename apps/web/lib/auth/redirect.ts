import { redirect, notFound } from "next/navigation"

/**
 * Next's `redirect()` and `notFound()` work by throwing special errors
 * (NEXT_REDIRECT / NEXT_NOT_FOUND). If they are called inside a try/catch,
 * the catch swallows them and the navigation silently fails.
 *
 * Use `callRedirecting(fn)` to wrap logic that may call redirect()/notFound(),
 * or keep redirect()/notFound() as the LAST statement outside any try.
 * This helper re-throws the control-flow errors so navigation still happens.
 */
export async function callRedirecting<T>(fn: () => Promise<T> | T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (isNextControlFlowError(err)) throw err
    throw err
  }
}

export function isNextControlFlowError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const digest = (err as Error & { digest?: string }).digest
  return (
    digest?.startsWith("NEXT_REDIRECT") === true ||
    digest === "NEXT_NOT_FOUND" ||
    err.message === "NEXT_REDIRECT" ||
    err.message === "NEXT_NOT_FOUND"
  )
}

export { redirect, notFound }
