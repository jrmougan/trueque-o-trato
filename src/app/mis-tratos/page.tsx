import { redirect } from "next/navigation"
import Link from "next/link"
import { Compass, Handshake } from "lucide-react"
import { auth } from "@/lib/auth"
import { getUserTrades } from "@/services/trade.service"
import { Button } from "@/components/ui/button"
import { TradeCard } from "./trade-card"

export default async function MisTratosPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const trades = await getUserTrades(session.user.id)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Handshake className="size-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Mis Tratos</h1>
      </div>
      <p className="mt-2 text-muted-foreground">
        Gestiona tus propuestas de trueque: acepta, rechaza o marca como
        completado.
      </p>

      {trades.length === 0 ? (
        <div className="mt-16 text-center">
          <Handshake className="mx-auto size-12 text-muted-foreground/40" />
          <h2 className="mt-4 text-lg font-semibold">
            No tienes tratos todavia
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explora objetos y propone tu primer trueque.
          </p>
          <Link href="/explorar" className="mt-6 inline-block">
            <Button>
              <Compass className="size-4" />
              Explorar objetos
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {trades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={{
                id: trade.id,
                status: trade.status,
                note: trade.note,
                sender: trade.sender,
                receiver: trade.receiver,
                itemOffered: trade.itemOffered,
                itemRequested: trade.itemRequested,
                createdAt: trade.createdAt.toISOString(),
              }}
              currentUserId={session.user!.id!}
            />
          ))}
        </div>
      )}
    </div>
  )
}
