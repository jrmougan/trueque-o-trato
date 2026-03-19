import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Email no valido"),
  password: z
    .string()
    .min(1, "La contrasena es obligatoria"),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede tener mas de 50 caracteres"),
    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("Email no valido"),
    password: z
      .string()
      .min(1, "La contrasena es obligatoria")
      .min(8, "La contrasena debe tener al menos 8 caracteres")
      .max(100, "La contrasena no puede tener mas de 100 caracteres"),
    confirmPassword: z
      .string()
      .min(1, "Confirma tu contrasena"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
