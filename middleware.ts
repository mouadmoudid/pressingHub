import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware temporairement désactivé pour éviter les conflits
export function middleware(request: NextRequest) {
  // Pas de middleware pour l'instant
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
