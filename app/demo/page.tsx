"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, User, Truck, Package, Clock, CheckCircle, TrendingUp, Gift, MapPin } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Pressing App - Démonstration</h1>
        <p className="text-muted-foreground">Aperçu de toutes les interfaces utilisateur</p>
      </div>

      <Tabs defaultValue="super-admin" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="super-admin">Super Admin</TabsTrigger>
          <TabsTrigger value="admin">Admin Pressing</TabsTrigger>
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="livreur">Livreur</TabsTrigger>
        </TabsList>

        {/* Super Admin Interface */}
        <TabsContent value="super-admin" className="space-y-6">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold">Interface Super Admin</h2>
            <Badge variant="destructive">Super Admin</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pressings</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">+3 nouveaux</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,567</div>
                <p className="text-xs text-muted-foreground">+18% ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€45,231</div>
                <p className="text-xs text-muted-foreground">+25% ce mois</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Admin Pressing Interface */}
        <TabsContent value="admin" className="space-y-6">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Interface Admin Pressing</h2>
            <Badge>Admin</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes du jour</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+5 depuis hier</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En traitement</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">À traiter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prêtes</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">À livrer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Livraisons</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Aujourd'hui</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Client Interface */}
        <TabsContent value="client" className="space-y-6">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold">Interface Client</h2>
            <Badge variant="secondary">Client</Badge>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Nettoyage à sec", price: "À partir de €8", icon: "👔" },
              { name: "Lavage & repassage", price: "À partir de €5", icon: "👕" },
              { name: "Pressing express", price: "À partir de €12", icon: "⚡" },
            ].map((service, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Livreur Interface */}
        <TabsContent value="livreur" className="space-y-6">
          <div className="flex items-center space-x-2">
            <Truck className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold">Interface Livreur</h2>
            <Badge variant="outline">Livreur</Badge>
          </div>

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

          <Card>
            <CardHeader>
              <CardTitle>Livraisons du jour</CardTitle>
              <CardDescription>Vos missions de livraison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { client: "Marie Dupont", address: "123 Rue de la Paix, Paris", status: "pending", time: "14:30" },
                  {
                    client: "Jean Martin",
                    address: "456 Avenue des Champs, Paris",
                    status: "in_progress",
                    time: "15:00",
                  },
                ].map((delivery, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-orange-600" />
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
                    <Button size="sm" variant={delivery.status === "pending" ? "default" : "outline"}>
                      {delivery.status === "pending" ? "Commencer" : "En cours"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
