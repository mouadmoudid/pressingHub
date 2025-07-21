"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

const errorMessages: Record<string, string> = {
  Configuration: "Il y a un problème avec la configuration du serveur.",
  AccessDenied: "Vous n'avez pas les permissions pour accéder à cette ressource.",
  Verification: "Le token de vérification a expiré ou a déjà été utilisé.",
  Default: "Une erreur inattendue s'est produite lors de l'authentification.",
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">Erreur d'authentification</CardTitle>
          <CardDescription className="text-gray-600">{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-sm text-gray-500">
            {error && (
              <p className="mb-2">
                Code d'erreur: <code className="bg-gray-100 px-2 py-1 rounded">{error}</code>
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Link href="/auth/signin" className="w-full">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
