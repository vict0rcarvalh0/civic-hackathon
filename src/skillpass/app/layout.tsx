import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import Providers from "@/components/providers"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
})

export const metadata: Metadata = {
  title: "SkillPass - Skills Passport with Reputation Staking",
  description:
    "Build your Web3 reputation with skill endorsements backed by crypto stakes. Get validated by your peers with skin in the game.",
  generator: "skillpass.app",
  icons: {
    icon: "icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Suspense>
          <Providers>
            <Navigation />
            {children}
            <Footer />
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}