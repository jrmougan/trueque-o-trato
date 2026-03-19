import { prisma } from "@/lib/prisma"

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      items: {
        where: { status: "AVAILABLE" },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          items: true,
          sentTrades: true,
          receivedTrades: true,
        },
      },
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function updateUserKarma(userId: string, increment: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      karma: { increment },
    },
  })
}
