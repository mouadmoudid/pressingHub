import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Statistiques globales pour le super admin
    const [totalUsers, totalPressings, totalOrders, totalRevenue, recentPressings, monthlyOrders] = await Promise.all([
      // Total utilisateurs
      prisma.user.count(),

      // Total pressings
      prisma.pressing.count(),

      // Total commandes
      prisma.order.count(),

      // Chiffre d'affaires total
      prisma.order.aggregate({
        _sum: {
          totalPrice: true,
        },
      }),

      // Pressings récents
      prisma.pressing.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          admin: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Commandes par mois (derniers 6 mois)
      prisma.order.groupBy({
        by: ["createdAt"],
        _count: {
          id: true,
        },
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
      }),
    ])

    // Statistiques par rôle
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        id: true,
      },
    })

    const roleStats = usersByRole.reduce(
      (acc, item) => {
        acc[item.role.toLowerCase()] = item._count.id
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalPressings,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        roleStats,
        recentPressings,
        monthlyOrders: monthlyOrders.length,
      },
    })
  } catch (error) {
    console.error("Super admin stats error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
