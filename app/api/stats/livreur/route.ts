import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const livreurId = searchParams.get("livreurId")

    if (!livreurId) {
      return NextResponse.json({ success: false, message: "Livreur ID requis" }, { status: 400 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [deliveriesPending, deliveriesInProgress, deliveriesCompleted, todayDeliveries] = await Promise.all([
      // Livraisons en attente
      prisma.delivery.count({
        where: {
          livreurId,
          status: "PENDING",
        },
      }),

      // Livraisons en cours
      prisma.delivery.count({
        where: {
          livreurId,
          status: "IN_TRANSIT",
        },
      }),

      // Livraisons terminées aujourd'hui
      prisma.delivery.count({
        where: {
          livreurId,
          status: "DELIVERED",
          deliveredAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Toutes les livraisons du jour
      prisma.delivery.findMany({
        where: {
          livreurId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          order: {
            include: {
              client: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        deliveriesPending,
        deliveriesInProgress,
        deliveriesCompleted,
        todayDeliveries,
      },
    })
  } catch (error) {
    console.error("Livreur stats error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
