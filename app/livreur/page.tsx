import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, CheckCircle, Package } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function LivreurDashboard() {
  return (
    <div className="p-6 space-y-6">
      <Navigation />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Livraisons</h1>
        <div className="text-sm text-muted-foreground">Aujourd'hui: 8 livraisons</div>
      </div>

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À livrer</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Commandes en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">En livraison</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livrées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
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
            {[
              { id: 1, client: "Marie Dupont", address: "123 Rue de la Paix, Paris", status: "pending", time: "14:30" },
              {
                id: 2,
                client: "Jean Martin",
                address: "456 Avenue des Champs, Paris",
                status: "in_progress",
                time: "15:00",
              },
              {
                id: 3,
                client: "Sophie Bernard",
                address: "789 Boulevard Saint-Germain, Paris",
                status: "pending",
                time: "15:30",
              },
              {
                id: 4,
                client: "Pierre Durand",
                address: "321 Rue de Rivoli, Paris",
                status: "delivered",
                time: "13:00",
              },
            ].map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      delivery.status === "delivered"
                        ? "bg-green-100"
                        : delivery.status === "in_progress"
                          ? "bg-blue-100"
                          : "bg-yellow-100"
                    }`}
                  >
                    {delivery.status === "delivered" ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : delivery.status === "in_progress" ? (
                      <Clock className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Package className="h-6 w-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{delivery.client}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {delivery.address}
                    </div>
                    <p className="text-xs text-muted-foreground">Prévu: {delivery.time}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {delivery.status === "pending" && <Button size="sm">Commencer</Button>}
                  {delivery.status === "in_progress" && (
                    <Button size="sm" variant="outline">
                      Marquer livré
                    </Button>
                  )}
                  {delivery.status === "delivered" && (
                    <span className="text-sm text-green-600 font-medium">✓ Livré</span>
                  )}
                  <Button size="sm" variant="ghost">
                    <MapPin className="h-4 w-4 mr-1" />
                    Voir carte
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
