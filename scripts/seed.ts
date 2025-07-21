import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Créer les utilisateurs par défaut
  const defaultUsers = [
    {
      name: "Super Admin",
      email: "admin@pressing.com",
      password: "password",
      role: UserRole.SUPER_ADMIN,
    },
    {
      name: "Admin Pressing",
      email: "pressing@example.com",
      password: "password",
      role: UserRole.ADMIN,
    },
    {
      name: "Marie Dupont",
      email: "client@example.com",
      password: "password",
      role: UserRole.CLIENT,
      phone: "06 12 34 56 78",
      address: "123 Rue de la Paix, 75001 Paris",
    },
    {
      name: "Jean Livreur",
      email: "livreur@example.com",
      password: "password",
      role: UserRole.LIVREUR,
      phone: "06 98 76 54 32",
    },
  ]

  for (const userData of defaultUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      })

      console.log(`✅ Created user: ${user.name} (${user.email})`)

      // Ajouter des points de bienvenue pour les clients
      if (user.role === UserRole.CLIENT) {
        await prisma.loyaltyPoint.create({
          data: {
            userId: user.id,
            points: 100,
            type: "BONUS",
            description: "Points de bienvenue",
          },
        })
        console.log(`🎁 Added welcome points for ${user.name}`)
      }
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`)
    }
  }

  // Créer un pressing exemple si l'admin existe
  const adminUser = await prisma.user.findUnique({
    where: { email: "pressing@example.com" },
  })

  if (adminUser) {
    const existingPressing = await prisma.pressing.findUnique({
      where: { adminId: adminUser.id },
    })

    if (!existingPressing) {
      const pressing = await prisma.pressing.create({
        data: {
          name: "Pressing Clean Pro",
          address: "456 Avenue des Champs, 75008 Paris",
          phone: "01 42 56 78 90",
          email: "contact@cleanpro.fr",
          description: "Pressing de qualité au cœur de Paris",
          adminId: adminUser.id,
        },
      })

      console.log(`🏢 Created pressing: ${pressing.name}`)

      // Créer des services exemple
      const services = [
        {
          name: "Nettoyage à sec",
          description: "Nettoyage professionnel à sec pour vos vêtements délicats",
          basePrice: 8.0,
          category: "Nettoyage",
          pressingId: pressing.id,
        },
        {
          name: "Lavage et repassage",
          description: "Lavage traditionnel suivi d'un repassage soigné",
          basePrice: 5.0,
          pricePerKg: 3.0,
          category: "Lavage",
          pressingId: pressing.id,
        },
        {
          name: "Pressing express",
          description: "Service rapide en moins de 24h",
          basePrice: 12.0,
          category: "Express",
          pressingId: pressing.id,
        },
      ]

      for (const serviceData of services) {
        const service = await prisma.service.create({
          data: serviceData,
        })
        console.log(`🧽 Created service: ${service.name}`)
      }
    }
  }

  console.log("✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
