import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers } from "@/lib/auth-db"

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers()

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        ...user,
        role: user.role.toLowerCase(),
      })),
    })
  } catch (error) {
    console.error("Get users API error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
