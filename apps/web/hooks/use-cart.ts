"use client"

import * as React from "react"
import { addToCart, readCart, type CartLine } from "@/store/cart"

export function useCart() {
  const [lines, setLines] = React.useState<CartLine[]>(() => readCart())

  const add = React.useCallback((productId: string, quantity = 1) => {
    setLines(addToCart(productId, quantity))
  }, [])

  const count = React.useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  )

  return { lines, count, add }
}
