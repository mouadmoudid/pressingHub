"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, Truck } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AdminStats {
  pressing: {
    id: string
    name: string
    address: string
  }
  ordersToday: number
  ordersProcessing: number
  ordersReady: number
  deliveriesToday: number
  recentOrders: Array<{
    id: string
    orderNumber: string
    status: string
    totalPrice: number
    createdAt: string
    client: { name: string }
  }>
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/stats/admin?adminId=${user?.id}`)
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

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "En attente",
      CONFIRMED: "Confirmé",
      PROCESSING: "En traitement",
      READY: "Prêt",
      OUT_FOR_DELIVERY: "En livraison",
      DELIVERED: "Livré",
      CANCELLED: "Annulé",
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PROCESSING: "bg-orange-100 text-orange-800",
      READY: "bg-green-100 text-green-800",
      OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    }
    return colorMap[status] || "bg-gray-100 text-gray-800"
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
        <div className="text-center text-red-600">Aucun pressing trouvé pour cet administrateur</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Navigation />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin Pressing</h1>
          <p className="text-muted-foreground">{stats.pressing.name}</p>
        </div>
      </div>

      {/* Statistiques du pressing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes du jour</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersToday}</div>
            <p className="text-xs text-muted-foreground">Nouvelles commandes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En traitement</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersProcessing}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prêtes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersReady}</div>
            <p className="text-xs text-muted-foreground">À livrer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livraisons</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveriesToday}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      {/* Commandes récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
          <CardDescription>Dernières commandes reçues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Commande #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">Client: {order.client.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">€{order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <p className="text-center text-muted-foreground">Aucune commande récente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
