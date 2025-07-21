"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login, user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await login(email.trim(), password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Email ou mot de passe incorrect")
      }
    } catch (err) {
      console.error("Sign in error:", err)
      setError("Une erreur est survenue lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (userType: string) => {
    const credentials: Record<string, { email: string; password: string }> = {
      admin: { email: "admin@pressing.com", password: "password" },
      pressing: { email: "pressing@example.com", password: "password" },
      client: { email: "client@example.com", password: "password" },
      livreur: { email: "livreur@example.com", password: "password" },
    }

    if (credentials[userType]) {
      setEmail(credentials[userType].email)
      setPassword(credentials[userType].password)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Connectez-vous à votre compte pressing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="votre@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Votre mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                S'inscrire
              </Link>
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="text-xs text-gray-500 text-center">
              <p className="font-medium mb-2">Comptes de démonstration :</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("admin")}
                disabled={loading}
                className="text-xs"
              >
                Super Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("pressing")}
                disabled={loading}
                className="text-xs"
              >
                Admin Pressing
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("client")}
                disabled={loading}
                className="text-xs"
              >
                Client
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("livreur")}
                disabled={loading}
                className="text-xs"
              >
                Livreur
              </Button>
            </div>

            <div className="text-xs text-gray-400 text-center">
              <p>
                Mot de passe pour tous: <code className="bg-gray-100 px-1 rounded">password</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
