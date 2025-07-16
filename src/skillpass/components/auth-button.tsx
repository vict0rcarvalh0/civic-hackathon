'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useUser } from "@civic/auth-web3/react"

export default function AuthButton() {
  const router = useRouter()
  const { user, isLoading, signIn, signOut } = useUser()

  /* ---------- Effects ---------- */

  // If a user is already logged‑in and happens to be on the landing page,
  // move them directly to the dashboard.
  useEffect(() => {
    if (user && window.location.pathname === "/") {
      router.replace("/dashboard")
    }
  }, [user, router])

  /* ---------- Handlers ---------- */

  const handleLogin = async () => {
    try {
      await signIn()
      router.replace("/dashboard")
    } catch (e) {
      console.error("Login failed", e)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (e) {
      console.error("Logout failed", e)
    }
  }

  /* ---------- UI ---------- */

  if (isLoading) {
    return (
      <Button 
        variant="outline" 
        disabled
        className="bg-white/5 border-white/10 text-gray-400"
      >
        Loading…
      </Button>
    )
  }

  if (user) {
    return (
      <Button 
        onClick={handleLogout} 
        variant="outline"
        className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
      >
        Logout
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleLogin}
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      Login with Civic
    </Button>
  )
}