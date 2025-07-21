import { type NextRequest, NextResponse } from "next/server"
import { redeemPoints, getUserLoyaltyBalance } from "../../../../lib/loyalty"

export async function POST(request: NextRequest) {
  try {
    const { userId, points, description } = await request.json()

    if (!userId || !points || points <= 0) {
      return NextResponse.json({ success: false, message: "Données invalides" }, { status: 400 })
    }

    const currentBalance = await getUserLoyaltyBalance(userId)

    if (currentBalance < points) {
      return NextResponse.json(
        {
          success: false,
          message: `Solde insuffisant. Vous avez ${currentBalance} points.`,
        },
        { status: 400 },
      )
    }

    const success = await redeemPoints(userId, points, description || "Utilisation de points")

    if (success) {
      const newBalance = await getUserLoyaltyBalance(userId)
      return NextResponse.json({
        success: true,
        message: "Points utilisés avec succès",
        newBalance,
      })
    } else {
      return NextResponse.json({ success: false, message: "Erreur lors de l'utilisation des points" }, { status: 400 })
    }
  } catch (error) {
    console.error("Redeem points error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
