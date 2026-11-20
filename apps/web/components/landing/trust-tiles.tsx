import { DoorFrameIcon } from "@/components/icons/door-frame-icon"
import { HandleHingeIcon } from "@/components/icons/handle-hinge-icon"
import { CylinderGearsIcon } from "@/components/icons/cylinder-gears-icon"
import { cn } from "@/lib/utils"
import { Section, SectionTitle } from "./section"

export interface TrustTile {
  icon: React.ReactNode
  title: string
  description: string
  tone?: "primary" | "muted"
}

const TRUST_TILES: TrustTile[] = [
  {
    icon: <DoorFrameIcon className="size-6 micro-tile-icon security-tile" strokeWidth={1.5} />,
    title: "أمان",
    description: "أجهزة أبواب من كبار علامات الأمان عالمية.",
    tone: "primary",
  },
  {
    icon: <HandleHingeIcon className="size-6 micro-tile-icon" strokeWidth={1.5} />,
    title: "فن الأصل",
    description: "أوكر ستانلس أصلي بضمان المصنع.",
    tone: "muted",
  },
  {
    icon: <CylinderGearsIcon className="size-6 micro-cylinder" strokeWidth={1.5} />,
    title: "دقة الكوالين",
    description: "محركات كوالين بدقة عالية جداً.",
    tone: "primary",
  },
  {
    icon: <HandleHingeIcon className="size-6 micro-tile-icon" strokeWidth={1.5} />,
    title: "احترافية",
    description: "نجوم 5 دعم فني وتوريد سريع.",
    tone: "muted",
  },
]

/** Trust tiles — trust/vouched marks (design §3.2 row 4). */
export function TrustTiles() {
  return (
    <Section className="bg-canvas">
      <SectionTitle eyebrow="لماذا تثقون بنا" title="لماذا تختارون أدواتنا" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {TRUST_TILES.map((tile) => (
          <div
            key={tile.title}
            className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <span className={cn("inline-flex items-center justify-center", tile.tone === "primary" ? "text-primary" : "text-muted")}>
              {tile.icon}
            </span>
            <h3 className="text-lg font-semibold text-ink">{tile.title}</h3>
            <p className="text-sm text-muted">{tile.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
