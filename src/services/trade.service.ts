import { prisma } from "@/lib/prisma"
import type { TradeStatus } from "@/generated/prisma/client"

export async function createTrade(data: {
  senderId: string
  receiverId: string
  itemOfferedId: string
  itemRequestedId: string
  note?: string
}) {
  return prisma.trade.create({
    data,
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
      itemOffered: true,
      itemRequested: true,
    },
  })
}

export async function getUserTrades(userId: string) {
  return prisma.trade.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
      itemOffered: { select: { id: true, title: true, images: true } },
      itemRequested: { select: { id: true, title: true, images: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateTradeStatus(id: string, status: TradeStatus) {
  return prisma.trade.update({
    where: { id },
    data: { status },
  })
}

export async function getTradeById(id: string) {
  return prisma.trade.findUnique({
    where: { id },
    include: {
      sender: { select: { id: true, name: true, image: true, karma: true } },
      receiver: {
        select: { id: true, name: true, image: true, karma: true },
      },
      itemOffered: true,
      itemRequested: true,
    },
  })
}
