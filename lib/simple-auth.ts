interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "client" | "livreur"
}

const users: User[] = [
  { id: "1", email: "admin@pressing.com", name: "Super Admin", role: "super_admin" },
  { id: "2", email: "pressing@example.com", name: "Admin Pressing", role: "admin" },
  { id: "3", email: "client@example.com", name: "Marie Dupont", role: "client" },
  { id: "4", email: "livreur@example.com", name: "Jean Livreur", role: "livreur" },
]

export function authenticateUser(email: string, password: string): User | null {
  if (password !== "password") return null
  return users.find((user) => user.email === email) || null
}

export function getUserById(id: string): User | null {
  return users.find((user) => user.id === id) || null
}
