"use client"

import { ReactNode } from "react"
import DashboardNavigation from "@/components/dashboard-navigation"
import { useRequireUser } from "@/hooks/use-require-user"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useRequireUser()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <p className="text-xl text-gray-600 animate-pulse">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <DashboardNavigation />
      {children}
    </div>
  )
}