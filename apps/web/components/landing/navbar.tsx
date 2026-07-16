"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Search, Heart, ShoppingCart, User, Globe, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { navLinks } from "@/lib/landing-data"

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white transition-shadow",
        scrolled ? "border-[#E2E8F0] shadow-sm" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10 lg:px-20">
        <Link href="/" className="text-xl font-bold text-[#0F3B73]">
          الرضا
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#1E293B] transition-colors hover:text-[#0F3B73]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button aria-label="بحث" className="hidden size-10 rounded-lg text-[#1E293B] transition-colors hover:bg-[#F1F5F9] md:inline-flex">
            <Search className="size-5" />
          </button>
          <button aria-label="المفضلة" className="hidden size-10 rounded-lg text-[#1E293B] transition-colors hover:bg-[#F1F5F9] md:inline-flex">
            <Heart className="size-5" />
          </button>
          <button aria-label="سلة الشراء" className="relative size-10 rounded-lg text-[#1E293B] transition-colors hover:bg-[#F1F5F9]">
            <ShoppingCart className="size-5" />
            <span className="absolute -left-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#F58220] text-[10px] font-bold text-white">
              0
            </span>
          </button>
          <button aria-label="تبديل اللغة" className="hidden size-10 rounded-lg text-[#1E293B] transition-colors hover:bg-[#F1F5F9] md:inline-flex">
            <Globe className="size-5" />
          </button>
          <button
            aria-label="حسابي"
            className="hidden size-10 rounded-lg text-[#1E293B] transition-colors hover:bg-[#F1F5F9] md:inline-flex"
          >
            <User className="size-5" />
          </button>
          <button
            aria-label="القائمة"
            className="size-10 rounded-lg text-[#1E293B] transition-colors hover:bg-[#F1F5F9] lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-[#E2E8F0] bg-white px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-[#1E293B]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
