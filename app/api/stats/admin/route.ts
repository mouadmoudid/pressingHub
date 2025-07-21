import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get("adminId")

    if (!adminId) {
      return NextResponse.json({ success: false, message: "Admin ID requis" }, { status: 400 })
    }

    // Trouver le pressing de cet admin
    const pressing = await prisma.pressing.findUnique({
      where: { adminId },
    })

    if (!pressing) {
      return NextResponse.json({ success: false, message: "Pressing non trouvé" }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [ordersToday, ordersProcessing, ordersReady, deliveriesToday, recentOrders] = await Promise.all([
      // Commandes du jour
      prisma.order.count({
        where: {
          pressingId: pressing.id,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Commandes en traitement
      prisma.order.count({
        where: {
          pressingId: pressing.id,
          status: "PROCESSING",
        },
      }),

      // Commandes prêtes
      prisma.order.count({
        where: {
          pressingId: pressing.id,
          status: "READY",
        },
      }),

      // Livraisons du jour
      prisma.delivery.count({
        where: {
          order: {
            pressingId: pressing.id,
          },
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Commandes récentes
      prisma.order.findMany({
        where: {
          pressingId: pressing.id,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          client: {
            select: {
              name: true,
            },
          },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        pressing,
        ordersToday,
        ordersProcessing,
        ordersReady,
        deliveriesToday,
        recentOrders,
      },
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
