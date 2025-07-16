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
      <Button variant="outline" disabled>
        Loading…
      </Button>
    )
  }

  if (user) {
    return (
      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    )
  }

  return (
    <Button onClick={handleLogin}>
      Login with Civic
    </Button>
  )
}