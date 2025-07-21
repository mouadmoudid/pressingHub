import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Star, Gift, Plus } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function ClientDashboard() {
  return (
    <div className="p-6 space-y-6">
      <Navigation />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mon Tableau de Bord</h1>
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
          <div className="text-3xl font-bold">1,250 points</div>
          <p className="text-blue-100">Vous êtes à 250 points d'une récompense !</p>
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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Commande #{2000 + i}</p>
                    <p className="text-sm text-muted-foreground">
                      {i === 1 ? "Pressing Clean Pro" : "Pressing Express"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        i === 1
                          ? "bg-green-100 text-green-800"
                          : i === 2
                            ? "bg-blue-100 text-blue-800"
                            : i === 3
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {i === 1 ? "Livré" : i === 2 ? "En livraison" : i === 3 ? "Prêt" : "En traitement"}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1">€{30 + i * 8}</p>
                  {i === 1 && (
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services favoris */}
      <Card>
        <CardHeader>
          <CardTitle>Services populaires</CardTitle>
          <CardDescription>Vos services les plus utilisés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Nettoyage à sec", price: "À partir de €8", icon: "👔" },
              { name: "Lavage & repassage", price: "À partir de €5", icon: "👕" },
              { name: "Pressing express", price: "À partir de €12", icon: "⚡" },
            ].map((service, i) => (
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
