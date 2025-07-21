"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Package, TrendingUp } from "lucide-react"
import { Navigation } from "@/components/navigation"

interface SuperAdminStats {
  totalUsers: number
  totalPressings: number
  totalOrders: number
  totalRevenue: number
  roleStats: Record<string, number>
  recentPressings: Array<{
    id: string
    name: string
    address: string
    admin: { name: string }
    createdAt: string
  }>
  monthlyOrders: number
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats/super-admin")
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Navigation />
        <div className="text-center">Chargement des statistiques...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6 space-y-6">
        <Navigation />
        <div className="text-center text-red-600">Erreur lors du chargement des données</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Navigation />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Super Admin</h1>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Clients: {stats.roleStats.client || 0} | Livreurs: {stats.roleStats.livreur || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pressings</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPressings}</div>
            <p className="text-xs text-muted-foreground">Établissements actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total des commandes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Revenus totaux</p>
          </CardContent>
        </Card>
      </div>

      {/* Pressings récents */}
      <Card>
        <CardHeader>
          <CardTitle>Pressings récents</CardTitle>
          <CardDescription>Derniers pressings ajoutés à la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentPressings.map((pressing) => (
              <div key={pressing.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{pressing.name}</p>
                  <p className="text-sm text-muted-foreground">{pressing.address}</p>
                  <p className="text-xs text-muted-foreground">Admin: {pressing.admin.name}</p>
                </div>
                <div className="text-sm text-green-600">Actif</div>
              </div>
            ))}
            {stats.recentPressings.length === 0 && (
              <p className="text-center text-muted-foreground">Aucun pressing récent</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
