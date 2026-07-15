export interface CartLine {
  productId: string
  quantity: number
}

const STORAGE_KEY = "alreda-cart"

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export function writeCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
}

export function addToCart(productId: string, quantity = 1): CartLine[] {
  const lines = readCart()
  const existing = lines.find((l) => l.productId === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    lines.push({ productId, quantity })
  }
  writeCart(lines)
  return lines
}
