import type { ItemStatus, TradeStatus } from "@/generated/prisma/client"

export type { ItemStatus, TradeStatus }

export interface NavItem {
  label: string
  href: string
  icon?: string
}

export const ITEM_CATEGORIES = [
  "Electronica",
  "Ropa y Accesorios",
  "Hogar y Jardin",
  "Deportes",
  "Libros y Entretenimiento",
  "Juguetes",
  "Vehiculos",
  "Arte y Manualidades",
  "Herramientas",
  "Otros",
] as const

export type ItemCategory = (typeof ITEM_CATEGORIES)[number]
