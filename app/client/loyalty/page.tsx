"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Star, TrendingUp, Calendar, ArrowLeft } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface LoyaltyData {
  balance: number
  history: Array<{
    id: string
    points: number
    type: string
    description: string
    createdAt: string
  }>
  nextThreshold: number
  pointsToNext: number
  rewardValue: number
}

export default function LoyaltyPage() {
  const { user } = useAuth()
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchLoyaltyData()
    }
  }, [user])

  const fetchLoyaltyData = async () => {
    try {
      const response = await fetch(`/api/loyalty/balance?userId=${user?.id}`)
      const data = await response.json()

      if (data.success) {
        setLoyaltyData(data.data)
      }
    } catch (error) {
      console.error("Error fetching loyalty data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRedeemPoints = async (points: number, description: string) => {
    try {
      const response = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          points,
          description,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Recharger les données
        fetchLoyaltyData()
        alert("Points utilisés avec succès !")
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error("Error redeeming points:", error)
      alert("Erreur lors de l'utilisation des points")
    }
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      EARNED: "Gagné",
      REDEEMED: "Utilisé",
      BONUS: "Bonus",
      EXPIRED: "Expiré",
    }
    return typeMap[type] || type
  }

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      EARNED: "bg-green-100 text-green-800",
      REDEEMED: "bg-red-100 text-red-800",
      BONUS: "bg-blue-100 text-blue-800",
      EXPIRED: "bg-gray-100 text-gray-800",
    }
    return colorMap[type] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Navigation />
        <div className="text-center">Chargement de vos points...</div>
      </div>
    )
  }

  if (!loyaltyData) {
    return (
      <div className="p-6 space-y-6">
        <Navigation />
        <div className="text-center text-red-600">Erreur lors du chargement des données</div>
      </div>
    )
  }

  const progressPercentage = ((loyaltyData.balance / loyaltyData.nextThreshold) * 100).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      <Navigation />

      <div className="flex items-center space-x-4">
        <Link href="/client">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Mes Points de Fidélité</h1>
          <p className="text-muted-foreground">Gagnez des points et obtenez des récompenses</p>
        </div>
      </div>

      {/* Solde principal */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="h-6 w-6 mr-2" />
            Votre solde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-2">{loyaltyData.balance} points</div>
          <p className="text-purple-100 mb-4">Valeur: €{loyaltyData.rewardValue.toFixed(2)}</p>

          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Prochain palier: {loyaltyData.nextThreshold} points</span>
              <span>{loyaltyData.pointsToNext} points restants</span>
            </div>
            <div className="w-full bg-purple-400 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Récompenses disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Récompenses disponibles</CardTitle>
          <CardDescription>Utilisez vos points pour obtenir des avantages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Réduction 5€</h3>
                <Badge variant="secondary">500 points</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Réduction de 5€ sur votre prochaine commande</p>
              <Button
                size="sm"
                className="w-full"
                disabled={loyaltyData.balance < 500}
                onClick={() => handleRedeemPoints(500, "Réduction 5€")}
              >
                {loyaltyData.balance >= 500 ? "Échanger" : "Pas assez de points"}
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Réduction 10€</h3>
                <Badge variant="secondary">1000 points</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Réduction de 10€ sur votre prochaine commande</p>
              <Button
                size="sm"
                className="w-full"
                disabled={loyaltyData.balance < 1000}
                onClick={() => handleRedeemPoints(1000, "Réduction 10€")}
              >
                {loyaltyData.balance >= 1000 ? "Échanger" : "Pas assez de points"}
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Service gratuit</h3>
                <Badge variant="secondary">2000 points</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Un service de pressing gratuit (jusqu'à 15€)</p>
              <Button
                size="sm"
                className="w-full"
                disabled={loyaltyData.balance < 2000}
                onClick={() => handleRedeemPoints(2000, "Service gratuit")}
              >
                {loyaltyData.balance >= 2000 ? "Échanger" : "Pas assez de points"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment gagner des points */}
      <Card>
        <CardHeader>
          <CardTitle>Comment gagner des points ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">Commandes</h3>
              <p className="text-sm text-muted-foreground">10 points par euro dépensé (minimum 5€)</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Bonus</h3>
              <p className="text-sm text-muted-foreground">Points bonus lors d'événements spéciaux</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">Parrainage</h3>
              <p className="text-sm text-muted-foreground">Bientôt disponible : parrainez vos amis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des points</CardTitle>
          <CardDescription>Vos dernières transactions de points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loyaltyData.history.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm">{transaction.description}</p>
                    <Badge variant="outline" className={getTypeColor(transaction.type)}>
                      {getTypeLabel(transaction.type)}
                    </Badge>
                  </div>
                  <div className={`text-lg font-bold ${transaction.points > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.points > 0 ? "+" : ""}
                    {transaction.points}
                  </div>
                </div>
              </div>
            ))}
            {loyaltyData.history.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Aucune transaction de points pour le moment</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
