"use server"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { createItem } from "@/services/item.service"
import { createItemSchema } from "@/lib/validations/item"

export type PublishState = {
  errors?: {
    title?: string[]
    description?: string[]
    category?: string[]
    condition?: string[]
    location?: string[]
  }
  message?: string
} | undefined

export async function publish(
  prevState: PublishState,
  formData: FormData
): Promise<PublishState> {
  // 1. Auth check
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  // 2. Validate input
  const validatedFields = createItemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    location: formData.get("location"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, category, condition, location } =
    validatedFields.data

  // 3. Collect image URLs from hidden inputs
  const images = formData.getAll("images").filter(
    (v): v is string => typeof v === "string" && v.length > 0
  )

  // 4. Create item
  const item = await createItem({
    title,
    description,
    images,
    category,
    condition,
    location: location || undefined,
    userId: session.user.id,
  })

  redirect(`/item/${item.id}`)
}
