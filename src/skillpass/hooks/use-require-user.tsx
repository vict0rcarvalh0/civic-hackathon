"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@civic/auth-web3/react"

/**
 * Require an authenticated Civic user.
 * If the user is not logged in once loading finishes, the caller is redirected
 * to /auth-required and this hook returns { user: null }.
 */
export function useRequireUser() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (user) return

    // Grace period (1 s) allows Civic to hydrate the session after hard reloads.
    const id = setTimeout(() => {
      router.replace("/auth-required")
    }, 3000)

    return () => clearTimeout(id)
  }, [isLoading, user, router])

  return { user, isLoading }
}