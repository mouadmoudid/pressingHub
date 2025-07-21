"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Star, Gift, Plus } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface ClientStats {
  loyaltyPoints: number
  recentOrders: Array<{
    id: string
    orderNumber: string
    status: string
    totalPrice: number
    createdAt: string
    pressing: { name: string }
  }>
  totalOrders: number
  totalSpent: number
  popularServices: Array<{
    name: string
    price: string
    icon: string
  }>
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ClientStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/stats/client?clientId=${user?.id}`)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getPointsToNextReward = (points: number) => {
    const nextRewardThreshold = Math.ceil(points / 500) * 500
    return nextRewardThreshold - points
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Navigation />
        <div className="text-center">Chargement de vos données...</div>
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

  const pointsToNext = getPointsToNextReward(stats.loyaltyPoints)

  return (
    <div className="p-6 space-y-6">
      <Navigation />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Tableau de Bord</h1>
          <p className="text-muted-foreground">
            {stats.totalOrders} commande{stats.totalOrders > 1 ? "s" : ""} • €{stats.totalSpent.toFixed(2)} dépensé
            {stats.totalOrders > 1 ? "s" : ""}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle commande
        </Button>
      </div>

      {/* Points de fidélité */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="h-5 w-5 mr-2" />
            Points de fidélité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.loyaltyPoints} points</div>
          <p className="text-blue-100 mb-4">
            {pointsToNext > 0
              ? `Vous êtes à ${pointsToNext} points d'une récompense !`
              : "Félicitations ! Vous pouvez obtenir une récompense !"}
          </p>
          <Link href="/client/loyalty">
            <Button variant="secondary" size="sm">
              Voir mes récompenses
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Commandes récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Mes commandes</CardTitle>
          <CardDescription>Historique de vos commandes récentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Commande #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.pressing.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1">€{order.totalPrice.toFixed(2)}</p>
                  {order.status === "DELIVERED" && (
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune commande pour le moment</p>
                <p className="text-sm">Commencez par passer votre première commande !</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services populaires */}
      <Card>
        <CardHeader>
          <CardTitle>Services populaires</CardTitle>
          <CardDescription>Nos services les plus demandés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.popularServices.map((service, i) => (
              <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">{service.icon}</div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.price}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
