"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router, mounted])

  // Éviter les erreurs d'hydratation
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Pressing App</CardTitle>
          <CardDescription className="text-gray-600">Plateforme de gestion de pressing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Accédez à votre espace ou créez un compte</p>
          </div>

          <div className="space-y-3">
            <Link href="/auth/signin" className="w-full">
              <Button className="w-full">Se connecter</Button>
            </Link>

            <Link href="/auth/register" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Créer un compte
              </Button>
            </Link>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>
              <strong>Comptes de démonstration :</strong>
            </p>
            <p>Super Admin: admin@pressing.com</p>
            <p>Admin Pressing: pressing@example.com</p>
            <p>Client: client@example.com</p>
            <p>Livreur: livreur@example.com</p>
            <p>Mot de passe: password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
