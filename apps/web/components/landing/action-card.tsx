import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IconTile } from "@/components/ui/icon-tile"

export interface ActionCardData {
  icon: React.ReactNode
  title: string
  description?: string
  href?: string
  buttonText: string
  external?: boolean
}

/**
 * Action card — icon + title + CTA button. Distinctive, clean, accessible.
 * Hover: color shift + lift (brand doc §2.3).
 */
export function ActionCard({
  icon,
  title,
  description,
  href,
  buttonText,
  external = true,
}: ActionCardData) {
  const button = (
    <Button variant="primary" size="md" className="mt-4">
      {buttonText}
    </Button>
  )
  return (
    <Card className="flex flex-col gap-3">
      <IconTile icon={icon} tone="primary" />
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-ink md:text-lg">{title}</h3>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </div>
      {href ? (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="inline-flex items-center justify-center"
        >
          {button}
        </Link>
      ) : (
        <span className="inline-flex">{button}</span>
      )}
    </Card>
  )
}
