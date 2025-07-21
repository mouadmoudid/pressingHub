import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth-db"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const result = await createUser(userData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      })
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Register API error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
