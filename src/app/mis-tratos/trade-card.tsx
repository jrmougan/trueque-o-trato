"use client"

import { useActionState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  Clock,
  Loader2,
  Package,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  acceptTrade,
  rejectTrade,
  completeTrade,
  type TradeActionState,
} from "./actions"

type TradeItem = {
  id: string
  title: string
  images: string[]
}

type TradeUser = {
  id: string
  name: string | null
  image: string | null
}

type Trade = {
  id: string
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "REJECTED"
  note: string | null
  sender: TradeUser
  receiver: TradeUser
  itemOffered: TradeItem
  itemRequested: TradeItem
  createdAt: string
}

const statusConfig = {
  PENDING: {
    label: "Pendiente",
    variant: "secondary" as const,
    icon: Clock,
  },
  ACCEPTED: {
    label: "Aceptado",
    variant: "default" as const,
    icon: Check,
  },
  COMPLETED: {
    label: "Completado",
    variant: "outline" as const,
    icon: Check,
  },
  REJECTED: {
    label: "Rechazado",
    variant: "destructive" as const,
    icon: X,
  },
}

function ItemPreview({ item }: { item: TradeItem }) {
  return (
    <Link
      href={`/item/${item.id}`}
      className="flex items-center gap-3 rounded-lg border p-2 transition-colors hover:bg-muted/50"
    >
      <div className="flex size-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/50">
        {item.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.images[0]}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="size-4 text-muted-foreground/40" />
        )}
      </div>
      <p className="min-w-0 truncate text-sm font-medium">{item.title}</p>
    </Link>
  )
}

function TradeActionButton({
  action,
  tradeId,
  label,
  loadingLabel,
  variant = "default",
}: {
  action: (
    prevState: TradeActionState,
    formData: FormData
  ) => Promise<TradeActionState>
  tradeId: string
  label: string
  loadingLabel: string
  variant?: "default" | "destructive" | "outline" | "secondary"
}) {
  const [state, formAction, pending] = useActionState<
    TradeActionState,
    FormData
  >(action, undefined)

  return (
    <form action={formAction}>
      <input type="hidden" name="tradeId" value={tradeId} />
      {state?.message && !state.success && (
        <p className="mb-1 text-xs text-destructive">{state.message}</p>
      )}
      <Button type="submit" size="sm" variant={variant} disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-3 animate-spin" />
            {loadingLabel}
          </>
        ) : (
          label
        )}
      </Button>
    </form>
  )
}

export function TradeCard({
  trade,
  currentUserId,
}: {
  trade: Trade
  currentUserId: string
}) {
  const isSender = trade.sender.id === currentUserId
  const isReceiver = trade.receiver.id === currentUserId
  const otherUser = isSender ? trade.receiver : trade.sender
  const config = statusConfig[trade.status]
  const StatusIcon = config.icon

  const createdAt = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(new Date(trade.createdAt))

  return (
    <div className="rounded-xl border p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant={config.variant} className="gap-1">
            <StatusIcon className="size-3" />
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground">{createdAt}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {isSender ? "Enviado" : "Recibido"}
        </span>
      </div>

      {/* Trade items */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1">
          <p className="mb-1 text-xs text-muted-foreground">
            {isSender ? "Ofreces" : `${trade.sender.name ?? "Usuario"} ofrece`}
          </p>
          <ItemPreview item={trade.itemOffered} />
        </div>
        <ArrowRight className="size-5 flex-shrink-0 text-muted-foreground" />
        <div className="flex-1">
          <p className="mb-1 text-xs text-muted-foreground">
            {isReceiver
              ? "Tu objeto"
              : `${trade.receiver.name ?? "Usuario"} tiene`}
          </p>
          <ItemPreview item={trade.itemRequested} />
        </div>
      </div>

      {/* Note */}
      {trade.note && (
        <div className="mt-3 rounded-md bg-muted/50 px-3 py-2">
          <p className="text-sm text-muted-foreground italic">
            &ldquo;{trade.note}&rdquo;
          </p>
        </div>
      )}

      {/* Other user */}
      <div className="mt-3 flex items-center justify-between">
        <Link
          href={`/perfil/${otherUser.id}`}
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          {isSender ? "Para: " : "De: "}
          <span className="font-medium">{otherUser.name ?? "Usuario"}</span>
        </Link>

        {/* Action buttons */}
        <div className="flex gap-2">
          {isReceiver && trade.status === "PENDING" && (
            <>
              <TradeActionButton
                action={acceptTrade}
                tradeId={trade.id}
                label="Aceptar"
                loadingLabel="Aceptando..."
                variant="default"
              />
              <TradeActionButton
                action={rejectTrade}
                tradeId={trade.id}
                label="Rechazar"
                loadingLabel="Rechazando..."
                variant="destructive"
              />
            </>
          )}
          {isReceiver && trade.status === "ACCEPTED" && (
            <TradeActionButton
              action={completeTrade}
              tradeId={trade.id}
              label="Marcar completado"
              loadingLabel="Completando..."
              variant="default"
            />
          )}
        </div>
      </div>
    </div>
  )
}
