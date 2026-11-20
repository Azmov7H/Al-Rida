import { statistics } from "@/lib/landing-data"

export function Statistics() {
  return (
    <section className="w-full bg-[#181818] py-16 text-white md:py-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-8 px-5 md:grid-cols-4 md:px-10 lg:px-20">
        {statistics.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-4xl font-bold text-[#C69214] md:text-5xl">
              {stat.value.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-white/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
