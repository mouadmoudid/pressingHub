import { prisma } from "./prisma"

export interface LoyaltyConfig {
  pointsPerEuro: number // Points gagnés par euro dépensé
  minimumOrderForPoints: number // Montant minimum pour gagner des points
  pointValue: number // Valeur d'un point en euros (ex: 100 points = 1€)
  welcomeBonus: number // Points de bienvenue
  expirationMonths: number // Durée de validité des points
}

export const LOYALTY_CONFIG: LoyaltyConfig = {
  pointsPerEuro: 10, // 10 points par euro dépensé
  minimumOrderForPoints: 5, // Minimum 5€ pour gagner des points
  pointValue: 0.01, // 1 point = 0.01€
  welcomeBonus: 100, // 100 points de bienvenue
  expirationMonths: 12, // Points valides 12 mois
}

export async function calculatePointsForOrder(orderAmount: number): Promise<number> {
  if (orderAmount < LOYALTY_CONFIG.minimumOrderForPoints) {
    return 0
  }
  return Math.floor(orderAmount * LOYALTY_CONFIG.pointsPerEuro)
}

export async function addPointsForOrder(userId: string, orderId: string, orderAmount: number) {
  const points = await calculatePointsForOrder(orderAmount)

  if (points > 0) {
    await prisma.loyaltyPoint.create({
      data: {
        userId,
        points,
        type: "EARNED",
        description: `Points gagnés pour la commande (€${orderAmount.toFixed(2)})`,
        orderId,
      },
    })
  }

  return points
}

export async function getUserLoyaltyBalance(userId: string): Promise<number> {
  const result = await prisma.loyaltyPoint.aggregate({
    where: {
      userId,
      createdAt: {
        gte: new Date(Date.now() - LOYALTY_CONFIG.expirationMonths * 30 * 24 * 60 * 60 * 1000),
      },
    },
    _sum: {
      points: true,
    },
  })

  return result._sum.points || 0
}

export async function getUserLoyaltyHistory(userId: string) {
  return await prisma.loyaltyPoint.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })
}

export async function redeemPoints(userId: string, pointsToRedeem: number, description: string): Promise<boolean> {
  const currentBalance = await getUserLoyaltyBalance(userId)

  if (currentBalance < pointsToRedeem) {
    return false
  }

  await prisma.loyaltyPoint.create({
    data: {
      userId,
      points: -pointsToRedeem, // Négatif pour déduire
      type: "REDEEMED",
      description,
    },
  })

  return true
}

export async function addWelcomeBonus(userId: string) {
  await prisma.loyaltyPoint.create({
    data: {
      userId,
      points: LOYALTY_CONFIG.welcomeBonus,
      type: "BONUS",
      description: "Points de bienvenue",
    },
  })
}

export function calculateRewardValue(points: number): number {
  return points * LOYALTY_CONFIG.pointValue
}

export function getNextRewardThreshold(currentPoints: number): number {
  const thresholds = [100, 250, 500, 1000, 2000, 5000]
  return thresholds.find((threshold) => threshold > currentPoints) || currentPoints + 1000
}
