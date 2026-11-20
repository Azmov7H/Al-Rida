"use client"

import * as React from "react"
import { Check, Copy, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IconTile } from "@/components/ui/icon-tile"
import { cn } from "@/lib/utils"

export interface WalletCardProps {
  number: string
  label: string
  instructions?: string
  buttonText?: string
}

/**
 * Wallet card — copy-to-clipboard for wallet details (E.164 style).
 * Style per brand doc §3.2: distinct from WhatsApp card, uses Wallet icon.
 */
export function WalletCard({
  number,
  label = "محفظة الشركة",
  instructions,
  buttonText = "شراء بالمحفظة",
}: WalletCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(number)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — silent fallback */
    }
  }, [number])

  return (
    <Card className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
      <div className="flex items-center gap-3">
        <IconTile icon={<Wallet className="size-6" />} />
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="mt-1 font-mono text-xs text-ink">{number}</p>
        </div>
      </div>
      {instructions ? (
        <p className="text-sm text-muted md:flex-1">{instructions}</p>
      ) : null}
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="نسخ الرقم"
          onClick={() => {
            void handleCopy()
          }}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2 text-sm font-semibold text-muted transition-colors hover:text-primary",
            copied && "text-primary",
          )}
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          {copied ? "تم النسخ" : "نسخ"}
        </button>
        <Button variant="primary" size="md">
          {buttonText}
        </Button>
      </div>
    </Card>
  )
}
