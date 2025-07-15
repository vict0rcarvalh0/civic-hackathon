import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { CivicAuthProvider } from "@civic/auth-web3/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Civic Auth Web3 Demo",
  description: "Comprehensive demonstration of Civic Auth Web3 features",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CivicAuthProvider>
          {children}
        </CivicAuthProvider>
      </body>
    </html>
  )
}
