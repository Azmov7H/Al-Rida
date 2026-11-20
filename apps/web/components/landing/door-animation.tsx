"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface DoorAnimationProps {
  children: React.ReactNode
}

/**
 * Signature door opening — the door swings open with CSS 3D transforms
 * (`door.css`), then leaves the way while the landing content is revealed.
 *
 * State machine (pure CSS-driven visuals, all transforms/visibility):
 *  - idle (0–100ms): closed door; content visible (no-JS fallback).
 *  - opening (100–540ms): door animates 0→100deg; content hidden.
 *  - done (540ms+): door leaves (visibility:hidden); content visible.
 *
 * `prefers-reduced-motion` — instant reveal, door visible.
 */
export function DoorAnimation({ children }: DoorAnimationProps) {
  const [phase, setPhase] = React.useState<"idle" | "opening" | "done">("idle")
  const prefersReduced = React.useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  React.useEffect(() => {
    if (prefersReduced.current) {
      setPhase("done")
      return
    }
    const t1 = setTimeout(() => setPhase("opening"), 100)
    const t2 = setTimeout(() => setPhase("done"), 540)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="door-stage">
      <div
        className={cn(
          "door-leaf",
          phase === "opening" && "open",
          phase === "done" && "gone",
        )}
        aria-hidden="true"
      >
        <div className="door-glass">
          <span className="door-handle" />
        </div>
        <div className="door-body">
          <span className="door-number">2</span>
        </div>
      </div>
      <div className={cn("door-content", phase === "opening" && "content-hidden")}>
        {children}
      </div>
    </div>
  )
}
