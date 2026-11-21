import "@workspace/ui/globals.css"
import "@/styles/globals.css"
import { Cairo, Inter, JetBrains_Mono, Readex_Pro } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

const cairoFont = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "600", "700", "800"],
})

const readexFont = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-readex",
  weight: ["400", "500", "600", "700"],
})

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})

const jetbrainsFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn(
        cairoFont.variable,
        readexFont.variable,
        interFont.variable,
        jetbrainsFont.variable,
      )}
      suppressHydrationWarning
    >
      <body className="bg-bg text-ink antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
