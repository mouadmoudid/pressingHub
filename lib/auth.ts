import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Utilisateurs de démonstration
        const users = [
          { id: "1", email: "admin@pressing.com", password: "password", name: "Super Admin", role: "super_admin" },
          { id: "2", email: "pressing@example.com", password: "password", name: "Admin Pressing", role: "admin" },
          { id: "3", email: "client@example.com", password: "password", name: "Marie Dupont", role: "client" },
          { id: "4", email: "livreur@example.com", password: "password", name: "Jean Livreur", role: "livreur" },
        ]

        const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as any
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
}
