"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { getTradeById, updateTradeStatus } from "@/services/trade.service"
import { updateItemStatus } from "@/services/item.service"
import { updateUserKarma } from "@/services/user.service"
import type { TradeStatus } from "@/generated/prisma/client"

export type TradeActionState = {
  success?: boolean
  message?: string
} | undefined

async function validateTradeAction(
  tradeId: string,
  allowedStatuses: TradeStatus[],
  requiredRole: "sender" | "receiver"
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "No autenticado." }
  }

  const trade = await getTradeById(tradeId)
  if (!trade) {
    return { error: "Trato no encontrado." }
  }

  if (!allowedStatuses.includes(trade.status)) {
    return { error: "Este trato no puede ser modificado en su estado actual." }
  }

  const userId = session.user.id
  if (requiredRole === "receiver" && trade.receiverId !== userId) {
    return { error: "No tienes permiso para realizar esta accion." }
  }
  if (requiredRole === "sender" && trade.senderId !== userId) {
    return { error: "No tienes permiso para realizar esta accion." }
  }

  return { trade, userId }
}

export async function acceptTrade(
  prevState: TradeActionState,
  formData: FormData
): Promise<TradeActionState> {
  const tradeId = formData.get("tradeId") as string
  const result = await validateTradeAction(tradeId, ["PENDING"], "receiver")

  if ("error" in result) {
    return { success: false, message: result.error }
  }

  await updateTradeStatus(tradeId, "ACCEPTED")
  revalidatePath("/mis-tratos")
  return { success: true, message: "Trato aceptado." }
}

export async function rejectTrade(
  prevState: TradeActionState,
  formData: FormData
): Promise<TradeActionState> {
  const tradeId = formData.get("tradeId") as string
  const result = await validateTradeAction(tradeId, ["PENDING"], "receiver")

  if ("error" in result) {
    return { success: false, message: result.error }
  }

  await updateTradeStatus(tradeId, "REJECTED")
  revalidatePath("/mis-tratos")
  return { success: true, message: "Trato rechazado." }
}

export async function completeTrade(
  prevState: TradeActionState,
  formData: FormData
): Promise<TradeActionState> {
  const tradeId = formData.get("tradeId") as string
  const result = await validateTradeAction(tradeId, ["ACCEPTED"], "receiver")

  if ("error" in result) {
    return { success: false, message: result.error }
  }

  const { trade } = result

  // Mark trade as completed
  await updateTradeStatus(tradeId, "COMPLETED")

  // Mark both items as traded
  await updateItemStatus(trade.itemOfferedId, "TRADED")
  await updateItemStatus(trade.itemRequestedId, "TRADED")

  // Award karma to both parties
  await updateUserKarma(trade.senderId, 1)
  await updateUserKarma(trade.receiverId, 1)

  revalidatePath("/mis-tratos")
  return { success: true, message: "Trueque completado! Ambos recibieron +1 karma." }
}
