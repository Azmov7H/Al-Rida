"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Copy, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IconTile } from "@/components/ui/icon-tile"

export function buildWaLink(number: string, preMessage?: string): string {
  const phone = number.replace(/[^+\d]/g, "")
  const message = preMessage?.trim()
  return message
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phone}`
}

export interface WhatsAppCardProps {
  number: string
  preMessage?: string
  buttonText?: string
}

/**
 * WhatsApp card — wa.me link with copy-to-clipboard for the E.164 number.
 * Style per brand doc §3.2: Wallet style card (surface + icons).
 */
export function WhatsAppCard({
  number,
  preMessage,
  buttonText = "راسلنا على واتساب",
}: WhatsAppCardProps) {
  const [copied, setCopied] = React.useState(false)
  const href = React.useMemo(() => buildWaLink(number, preMessage), [number, preMessage])

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
        <IconTile icon={<MessageCircle className="size-6" />} />
        <div>
          <p className="text-sm font-semibold text-ink">رسالة واتساب</p>
          <p className="mt-1 font-mono text-xs text-ink">{number}</p>
        </div>
      </div>
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
          {copied ? (
            <Check className="size-4 text-success" />
          ) : (
            <Copy className="size-4" />
          )}
          {copied ? "تم النسخ" : "نسخ"}
        </button>
        <Link href={href} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="md">
            {buttonText}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
