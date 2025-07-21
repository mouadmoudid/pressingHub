import { type NextRequest, NextResponse } from "next/server"
import {
  getUserLoyaltyBalance,
  getUserLoyaltyHistory,
  getNextRewardThreshold,
  calculateRewardValue,
} from "../../../../lib/loyalty"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID requis" }, { status: 400 })
    }

    const [balance, history] = await Promise.all([getUserLoyaltyBalance(userId), getUserLoyaltyHistory(userId)])

    const nextThreshold = getNextRewardThreshold(balance)
    const pointsToNext = nextThreshold - balance
    const rewardValue = calculateRewardValue(balance)

    return NextResponse.json({
      success: true,
      data: {
        balance,
        history,
        nextThreshold,
        pointsToNext,
        rewardValue,
      },
    })
  } catch (error) {
    console.error("Loyalty balance error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
