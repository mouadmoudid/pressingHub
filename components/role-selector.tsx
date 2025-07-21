"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, User, Truck } from "lucide-react"

interface RoleSelectorProps {
  onRoleSelect: (role: string, userData: any) => void
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: "super_admin",
      name: "Super Admin",
      description: "Gestion globale de la plateforme",
      icon: Users,
      color: "bg-red-100 text-red-600",
      user: {
        id: "1",
        name: "Super Admin",
        email: "admin@pressing.com",
        role: "super_admin",
      },
    },
    {
      id: "admin",
      name: "Admin Pressing",
      description: "Gestion d'un pressing spécifique",
      icon: Building2,
      color: "bg-blue-100 text-blue-600",
      user: {
        id: "2",
        name: "Admin Pressing",
        email: "pressing@example.com",
        role: "admin",
      },
    },
    {
      id: "client",
      name: "Client",
      description: "Commandes et suivi",
      icon: User,
      color: "bg-green-100 text-green-600",
      user: {
        id: "3",
        name: "Marie Dupont",
        email: "client@example.com",
        role: "client",
      },
    },
    {
      id: "livreur",
      name: "Livreur",
      description: "Livraisons et collectes",
      icon: Truck,
      color: "bg-orange-100 text-orange-600",
      user: {
        id: "4",
        name: "Jean Livreur",
        email: "livreur@example.com",
        role: "livreur",
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Pressing App - Preview</CardTitle>
          <CardDescription>Sélectionnez un rôle pour voir l'interface correspondante</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Card
                  key={role.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                  onClick={() => onRoleSelect(role.id, role.user)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full ${role.color} flex items-center justify-center mx-auto`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{role.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                    <Badge variant="outline" className="mt-2">
                      Voir l'interface
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Cliquez sur un rôle pour accéder directement à son interface sans authentification
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
