"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import "@/styles/door.css"

export interface DoorAnimationProps {
  children: React.ReactNode
}

/**
 * Cinematic intro: an Awkar product door from Al-Ahram Company opens
 * to reveal the Al-Reda experience. Respects prefers-reduced-motion.
 */
export function DoorAnimation({ children }: DoorAnimationProps) {
  const [phase, setPhase] = React.useState<"idle" | "opening" | "done">("idle")
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  React.useEffect(() => {
    if (reduced) {
      setPhase("done")
      return
    }
    setPhase("idle")
    const t1 = window.setTimeout(() => setPhase("opening"), 500)
    const t2 = window.setTimeout(() => setPhase("done"), 2300)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [reduced])

  return (
    <div className={cn("cinema-intro", phase === "done" && "cinema-intro--done")}>
      <div
        className={cn(
          "cinema-scene",
          phase === "idle" && "cinema-scene--idle",
          phase === "opening" && "cinema-scene--opening",
          phase === "done" && "cinema-scene--gone",
        )}
        aria-hidden="true"
      >
        <div className="cinema-backdrop" />
        <div className="cinema-light cinema-light--one" />
        <div className="cinema-light cinema-light--two" />
        <div className="cinema-vignette" />

        <div className="cinema-frame">
          <div className="cinema-frame__inner">
            <div className={cn("door-leaf", phase === "opening" && "open")}>
              <div className="door-glass">
                <div className="door-glass__shine" />
                <div className="door-brand-mark">
                  <span className="door-brand-mark__ar">الأهرام</span>
                  <span className="door-brand-mark__en">AL-AHRAM</span>
                </div>
              </div>
              <div className="door-body">
                <span className="door-product-kicker">منتج أوكر</span>
                <span className="door-product-name">AWKAR</span>
                <span className="door-product-sub">حلول أبواب وأقفال أصلية</span>
                <span className="door-handle" aria-hidden="true" />
              </div>
            </div>
            <div className="cinema-threshold" />
          </div>
        </div>

        <div className="cinema-caption">
          <p className="cinema-caption__brand">الرضا</p>
          <p className="cinema-caption__line">تجربة أوكر مميزة من شركة الأهرام</p>
        </div>
      </div>

      <div className={cn("door-content", phase !== "done" && "door-content--hidden")}>
        {children}
      </div>
    </div>
  )
}
