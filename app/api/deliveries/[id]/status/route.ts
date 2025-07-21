import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const deliveryId = params.id

    if (!status) {
      return NextResponse.json({ success: false, message: "Statut requis" }, { status: 400 })
    }

    const updateData: any = { status }

    // Ajouter les timestamps selon le statut
    if (status === "PICKED_UP") {
      updateData.pickupAt = new Date()
    } else if (status === "DELIVERED") {
      updateData.deliveredAt = new Date()
    }

    const delivery = await prisma.delivery.update({
      where: { id: deliveryId },
      data: updateData,
    })

    // Mettre à jour le statut de la commande si nécessaire
    if (status === "DELIVERED") {
      await prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: "DELIVERED", completedAt: new Date() },
      })
    } else if (status === "IN_TRANSIT") {
      await prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: "OUT_FOR_DELIVERY" },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Statut mis à jour avec succès",
    })
  } catch (error) {
    console.error("Update delivery status error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
