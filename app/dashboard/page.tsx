"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/auth/signin")
      return
    }

    // Redirection selon le rôle
    switch (user.role) {
      case "super_admin":
        router.push("/super-admin")
        break
      case "admin":
        router.push("/admin")
        break
      case "client":
        router.push("/client")
        break
      case "livreur":
        router.push("/livreur")
        break
      default:
        router.push("/auth/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Redirection en cours...</div>
      </div>
    )
  }

  return null
}
