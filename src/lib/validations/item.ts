import { z } from "zod"
import { ITEM_CATEGORIES } from "@/types"

export const ITEM_CONDITIONS = [
  "Nuevo",
  "Como nuevo",
  "Buen estado",
  "Usado",
  "Para reparar",
] as const

export type ItemCondition = (typeof ITEM_CONDITIONS)[number]

export const createItemSchema = z.object({
  title: z
    .string()
    .min(1, "El titulo es obligatorio")
    .min(3, "El titulo debe tener al menos 3 caracteres")
    .max(100, "El titulo no puede tener mas de 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripcion es obligatoria")
    .min(10, "La descripcion debe tener al menos 10 caracteres")
    .max(2000, "La descripcion no puede tener mas de 2000 caracteres"),
  category: z
    .string()
    .min(1, "La categoria es obligatoria")
    .refine((val) => (ITEM_CATEGORIES as readonly string[]).includes(val), {
      message: "Categoria no valida",
    }),
  condition: z
    .string()
    .min(1, "El estado es obligatorio")
    .refine((val) => (ITEM_CONDITIONS as readonly string[]).includes(val), {
      message: "Estado no valido",
    }),
  location: z
    .string()
    .max(100, "La ubicacion no puede tener mas de 100 caracteres")
    .optional()
    .or(z.literal("")),
})

export type CreateItemInput = z.infer<typeof createItemSchema>
