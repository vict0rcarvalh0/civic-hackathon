"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthRequiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4">
      <div className="max-w-md text-center bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Login Required
        </h1>
        <p className="text-gray-700 mb-8">
          You need to be signed in with Civic to view the dashboard. Please log in and try again.
        </p>
        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    </div>
  )
}