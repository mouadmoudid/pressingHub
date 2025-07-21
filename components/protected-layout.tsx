"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedLayoutProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedLayout({ children, allowedRoles }: ProtectedLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      router.push("/unauthorized")
      return
    }
  }, [session, status, router, allowedRoles])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return null
  }

  return <>{children}</>
}
