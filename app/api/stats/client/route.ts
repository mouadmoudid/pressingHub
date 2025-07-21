import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    if (!clientId) {
      return NextResponse.json({ success: false, message: "Client ID requis" }, { status: 400 })
    }

    const [loyaltyPoints, recentOrders, totalOrders, totalSpent] = await Promise.all([
      // Points de fidélité
      prisma.loyaltyPoint.aggregate({
        where: {
          userId: clientId,
        },
        _sum: {
          points: true,
        },
      }),

      // Commandes récentes
      prisma.order.findMany({
        where: {
          clientId,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          pressing: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Total commandes
      prisma.order.count({
        where: {
          clientId,
        },
      }),

      // Total dépensé
      prisma.order.aggregate({
        where: {
          clientId,
        },
        _sum: {
          totalPrice: true,
        },
      }),
    ])

    // Services populaires (simulé pour l'instant)
    const popularServices = [
      { name: "Nettoyage à sec", price: "À partir de €8", icon: "👔" },
      { name: "Lavage & repassage", price: "À partir de €5", icon: "👕" },
      { name: "Pressing express", price: "À partir de €12", icon: "⚡" },
    ]

    return NextResponse.json({
      success: true,
      data: {
        loyaltyPoints: loyaltyPoints._sum.points || 0,
        recentOrders,
        totalOrders,
        totalSpent: totalSpent._sum.totalPrice || 0,
        popularServices,
      },
    })
  } catch (error) {
    console.error("Client stats error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
