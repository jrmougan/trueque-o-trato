import { prisma } from "@/lib/prisma"
import type { ItemStatus } from "@/generated/prisma/client"

export async function getAvailableItems(options?: {
  category?: string
  search?: string
  take?: number
  skip?: number
}) {
  const { category, search, take = 20, skip = 0 } = options ?? {}

  return prisma.item.findMany({
    where: {
      status: "AVAILABLE",
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      user: {
        select: { id: true, name: true, image: true, karma: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
    skip,
  })
}

export async function getItemById(id: string) {
  return prisma.item.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, image: true, karma: true },
      },
    },
  })
}

export async function getUserItems(userId: string, status?: ItemStatus) {
  return prisma.item.findMany({
    where: {
      userId,
      ...(status && { status }),
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function createItem(data: {
  title: string
  description: string
  images: string[]
  category: string
  condition?: string
  location?: string
  userId: string
}) {
  return prisma.item.create({ data })
}

export async function updateItemStatus(id: string, status: ItemStatus) {
  return prisma.item.update({
    where: { id },
    data: { status },
  })
}
