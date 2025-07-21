import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Fallback handler en cas d'erreur
export async function fallbackHandler() {
  return new Response(JSON.stringify({ error: "Configuration error" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  })
}

// Wrap the original exports with a try-catch block
try {
  // Use the fallback handler if NextAuth fails to initialize
  const getHandler = handler.GET || fallbackHandler
  const postHandler = handler.POST || fallbackHandler

  export { getHandler as GET, postHandler as POST }
} catch (error) {
  console.error("NextAuth configuration error:", error)
}
