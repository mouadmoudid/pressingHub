import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import type { UserRole } from "@prisma/client"
import { addWelcomeBonus } from "./loyalty"

export interface CreateUserData {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  role: "CLIENT" | "LIVREUR"
}

export interface LoginCredentials {
  email: string
  password: string
}

export async function createUser(userData: CreateUserData) {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    })

    if (existingUser) {
      return { success: false, message: "Cet email est déjà utilisé" }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Convertir le rôle string en enum Prisma
    const roleMapping: Record<string, UserRole> = {
      CLIENT: "CLIENT",
      LIVREUR: "LIVREUR",
      client: "CLIENT",
      livreur: "LIVREUR",
    }

    const prismaRole = roleMapping[userData.role] || "CLIENT"

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        address: userData.address,
        role: prismaRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    })

    // Ajouter des points de bienvenue pour les clients
    if (prismaRole === "CLIENT") {
      await addWelcomeBonus(user.id)
    }

    return { success: true, message: "Inscription réussie !", user }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, message: "Une erreur est survenue lors de l'inscription" }
  }
}

export async function authenticateUser(credentials: LoginCredentials) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    })

    if (!user) {
      return null
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password)

    if (!isValidPassword) {
      return null
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error getting user by id:", error)
    return null
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return users
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}
