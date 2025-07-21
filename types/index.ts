export interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "client" | "livreur"
  phone?: string
  address?: string
  pressingId?: string
}

export interface Pressing {
  id: string
  name: string
  address: string
  phone: string
  adminId: string
  services: Service[]
}

export interface Service {
  id: string
  name: string
  basePrice: number
  pricePerKg?: number
  options: ServiceOption[]
}

export interface ServiceOption {
  id: string
  name: string
  price: number
}

export interface Order {
  id: string
  clientId: string
  pressingId: string
  services: OrderService[]
  status: "pending" | "processing" | "ready" | "delivered"
  totalPrice: number
  deliveryAddress: string
  createdAt: Date
  deliveredAt?: Date
  livreurId?: string
}

export interface OrderService {
  serviceId: string
  quantity: number
  weight?: number
  options: string[]
}
