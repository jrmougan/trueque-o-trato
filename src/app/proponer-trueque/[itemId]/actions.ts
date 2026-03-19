"use server"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { createTrade } from "@/services/trade.service"
import { getItemById } from "@/services/item.service"
import { createTradeSchema } from "@/lib/validations/trade"

export type ProposeTradeState =
  | {
      errors?: {
        itemOfferedId?: string[]
        note?: string[]
      }
      message?: string
    }
  | undefined

export async function proposeTrade(
  prevState: ProposeTradeState,
  formData: FormData
): Promise<ProposeTradeState> {
  // 1. Auth check
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  // 2. Validate input
  const validatedFields = createTradeSchema.safeParse({
    itemOfferedId: formData.get("itemOfferedId"),
    itemRequestedId: formData.get("itemRequestedId"),
    note: formData.get("note"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { itemOfferedId, itemRequestedId, note } = validatedFields.data

  // 3. Verify the requested item exists and is available
  const requestedItem = await getItemById(itemRequestedId)
  if (!requestedItem || requestedItem.status !== "AVAILABLE") {
    return { message: "El objeto solicitado ya no esta disponible." }
  }

  // 4. Verify the user is not trying to trade with themselves
  if (requestedItem.userId === session.user.id) {
    return { message: "No puedes proponer un trueque por tu propio objeto." }
  }

  // 5. Verify the offered item belongs to the current user and is available
  const offeredItem = await getItemById(itemOfferedId)
  if (!offeredItem || offeredItem.userId !== session.user.id) {
    return { message: "El objeto ofrecido no te pertenece." }
  }
  if (offeredItem.status !== "AVAILABLE") {
    return { message: "El objeto que ofreces ya no esta disponible." }
  }

  // 6. Create the trade
  await createTrade({
    senderId: session.user.id,
    receiverId: requestedItem.userId,
    itemOfferedId,
    itemRequestedId,
    note: note || undefined,
  })

  redirect("/mis-tratos")
}
