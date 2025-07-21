"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "client" | "livreur"
  phone?: string
  address?: string
  createdAt?: string
}

interface PreviewContextType {
  user: User | null
  setUser: (user: User | null) => void
  isPreviewMode: boolean
  setPreviewMode: (mode: boolean) => void
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined)

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isPreviewMode, setPreviewMode] = useState(true)

  return (
    <PreviewContext.Provider value={{ user, setUser, isPreviewMode, setPreviewMode }}>
      {children}
    </PreviewContext.Provider>
  )
}

export function usePreview() {
  const context = useContext(PreviewContext)
  if (context === undefined) {
    throw new Error("usePreview must be used within a PreviewProvider")
  }
  return context
}
