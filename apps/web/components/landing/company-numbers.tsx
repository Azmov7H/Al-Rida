"use client"

import * as React from "react"
import { statistics } from "@/lib/landing-data"

function useCountUp(target: number) {
  const [value, setValue] = React.useState(0)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry || !entry.isIntersecting) return
        const duration = 1200
        const start = performance.now()
        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1)
          setValue(Math.round(progress * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [target])

  return { ref, value }
}

function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: current } = useCountUp(value)
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-[#0F3B73] md:text-5xl">
        <span ref={ref}>{current.toLocaleString("ar-EG")}</span>
        {suffix}
      </p>
      <p className="mt-2 text-sm text-[#64748B]">{label}</p>
    </div>
  )
}

export function CompanyNumbers() {
  return (
    <section className="w-full bg-[#0F3B73] py-16 text-white md:py-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-8 px-5 md:grid-cols-3 md:px-10 lg:grid-cols-5 lg:px-20">
        {statistics.map((stat) => (
          <Counter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
        ))}
      </div>
    </section>
  )
}
