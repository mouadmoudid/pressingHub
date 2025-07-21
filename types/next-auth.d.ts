declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "super_admin" | "admin" | "client" | "livreur"
      pressingId?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: "super_admin" | "admin" | "client" | "livreur"
    pressingId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "super_admin" | "admin" | "client" | "livreur"
    pressingId?: string
  }
}
