"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Administrateur"
      case "admin":
        return "Admin Pressing"
      case "client":
        return "Client"
      case "livreur":
        return "Livreur"
      default:
        return "Utilisateur"
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <Card className="mb-6">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{getRoleLabel(user.role)}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </Button>
      </CardContent>
    </Card>
  )
}
