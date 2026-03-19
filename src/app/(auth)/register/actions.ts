"use server"

import { hash } from "bcryptjs"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { signIn } from "@/lib/auth"
import { registerSchema } from "@/lib/validations/auth"
import { AuthError } from "next-auth"

export type RegisterState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  message?: string
} | undefined

export async function register(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // 1. Validate input
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  // 2. Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return {
      errors: {
        email: ["Ya existe una cuenta con este email"],
      },
    }
  }

  // 3. Hash password and create user
  const hashedPassword = await hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // 4. Auto-login after registration
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Cuenta creada, pero hubo un error al iniciar sesion. Intenta iniciar sesion manualmente.",
      }
    }
    throw error
  }

  redirect("/")
}
