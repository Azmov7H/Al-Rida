export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ")
}

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[ًَُِّْـ]/g, "") // Arabic diacritics + tatweel
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "") // keep letters (incl. Arabic) + numbers + dashes
  const clean = base.replace(/^-+|-+$/g, "")
  if (clean.length < 2) {
    return `item-${Math.random().toString(36).slice(2, 8)}`
  }
  return clean
}

export function generateSku(prefix = "PRD"): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  const time = Date.now().toString(36).slice(-4).toUpperCase()
  return `${prefix}-${time}${rand}`
}

export function formatCurrency(amount: number, currency = "EGP"): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
  }).format(amount)
}
