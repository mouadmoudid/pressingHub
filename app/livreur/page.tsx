"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, CheckCircle, Package } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"

interface LivreurStats {
  deliveriesPending: number
  deliveriesInProgress: number
  deliveriesCompleted: number
  todayDeliveries: Array<{
    id: string
    status: string
    pickupAt: string | null
    deliveredAt: string | null
    order: {
      id: string
      orderNumber: string
      deliveryAddress: string
      deliveryPhone: string | null
      client: { name: string }
    }
  }>
}

export default function LivreurDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<LivreurStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/stats/livreur?livreurId=${user?.id}`)
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
      ASSIGNED: "Assigné",
      PICKED_UP: "Récupéré",
      IN_TRANSIT: "En transit",
      DELIVERED: "Livré",
      FAILED: "Échec",
    }
    return statusMap[status] || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "IN_TRANSIT":
        return <Clock className="h-6 w-6 text-blue-600" />
      default:
        return <Package className="h-6 w-6 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: "bg-yellow-100",
      ASSIGNED: "bg-blue-100",
      PICKED_UP: "bg-orange-100",
      IN_TRANSIT: "bg-blue-100",
      DELIVERED: "bg-green-100",
      FAILED: "bg-red-100",
    }
    return colorMap[status] || "bg-gray-100"
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "Non défini"
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleUpdateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Recharger les données
        fetchStats()
      }
    } catch (error) {
      console.error("Error updating delivery status:", error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Navigation />
        <div className="text-center">Chargement de vos livraisons...</div>
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

  const totalDeliveries = stats.deliveriesPending + stats.deliveriesInProgress + stats.deliveriesCompleted

  return (
    <div className="p-6 space-y-6">
      <Navigation />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Livraisons</h1>
          <p className="text-muted-foreground">
            Aujourd'hui: {totalDeliveries} livraison{totalDeliveries > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À livrer</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveriesPending}</div>
            <p className="text-xs text-muted-foreground">Commandes en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveriesInProgress}</div>
            <p className="text-xs text-muted-foreground">En livraison</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livrées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveriesCompleted}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des livraisons */}
      <Card>
        <CardHeader>
          <CardTitle>Livraisons du jour</CardTitle>
          <CardDescription>Vos missions de livraison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.todayDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(delivery.status)}`}
                  >
                    {getStatusIcon(delivery.status)}
                  </div>
                  <div>
                    <p className="font-medium">{delivery.order.client.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {delivery.order.deliveryAddress}
                    </div>
                    {delivery.order.deliveryPhone && (
                      <p className="text-xs text-muted-foreground">Tél: {delivery.order.deliveryPhone}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Commande: #{delivery.order.orderNumber}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="text-right">
                    <span className="text-sm font-medium">{getStatusLabel(delivery.status)}</span>
                    {delivery.pickupAt && (
                      <p className="text-xs text-muted-foreground">Récupéré: {formatTime(delivery.pickupAt)}</p>
                    )}
                    {delivery.deliveredAt && (
                      <p className="text-xs text-muted-foreground">Livré: {formatTime(delivery.deliveredAt)}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {delivery.status === "PENDING" && (
                      <Button size="sm" onClick={() => handleUpdateDeliveryStatus(delivery.id, "IN_TRANSIT")}>
                        Commencer
                      </Button>
                    )}
                    {delivery.status === "IN_TRANSIT" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateDeliveryStatus(delivery.id, "DELIVERED")}
                      >
                        Marquer livré
                      </Button>
                    )}
                    {delivery.status === "DELIVERED" && (
                      <span className="text-sm text-green-600 font-medium">✓ Livré</span>
                    )}
                    <Button size="sm" variant="ghost">
                      <MapPin className="h-4 w-4 mr-1" />
                      Carte
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {stats.todayDeliveries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune livraison programmée pour aujourd'hui</p>
                <p className="text-sm">Profitez de votre journée de repos !</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
