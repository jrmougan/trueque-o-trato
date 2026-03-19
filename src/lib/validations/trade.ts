import { z } from "zod"

export const createTradeSchema = z.object({
  itemOfferedId: z.string().min(1, "Debes seleccionar un objeto para ofrecer"),
  itemRequestedId: z
    .string()
    .min(1, "El objeto solicitado es obligatorio"),
  note: z
    .string()
    .max(500, "La nota no puede tener mas de 500 caracteres")
    .optional()
    .or(z.literal("")),
})

export type CreateTradeInput = z.infer<typeof createTradeSchema>
