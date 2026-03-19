"use server"

import { redirect } from "next/navigation"
import { signIn } from "@/lib/auth"
import { loginSchema } from "@/lib/validations/auth"
import { AuthError } from "next-auth"

export type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
} | undefined

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // 1. Validate input
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  // 2. Attempt sign in
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Email o contrasena incorrectos",
          }
        default:
          return {
            message: "Ocurrio un error al iniciar sesion. Intenta de nuevo.",
          }
      }
    }
    throw error
  }

  redirect("/")
}
