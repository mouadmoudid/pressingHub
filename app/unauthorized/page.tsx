import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">Accès non autorisé</CardTitle>
          <CardDescription className="text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Link href="/dashboard">
            <Button className="w-full">Retour au tableau de bord</Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="outline" className="w-full bg-transparent">
              Se reconnecter
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
