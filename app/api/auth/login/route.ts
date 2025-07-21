import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth-db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email et mot de passe requis" }, { status: 400 })
    }

    const user = await authenticateUser({ email, password })

    if (!user) {
      return NextResponse.json({ success: false, message: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
