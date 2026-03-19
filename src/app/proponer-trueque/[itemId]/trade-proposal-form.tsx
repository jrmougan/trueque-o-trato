"use client"

import { useActionState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Package, Repeat2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { proposeTrade, type ProposeTradeState } from "./actions"

type RequestedItem = {
  id: string
  title: string
  images: string[]
  category: string
  condition: string | null
  user: { id: string; name: string | null }
}

type UserItem = {
  id: string
  title: string
  images: string[]
  category: string
  condition: string | null
}

export function TradeProposalForm({
  requestedItem,
  userItems,
}: {
  requestedItem: RequestedItem
  userItems: UserItem[]
}) {
  const [state, formAction, pending] = useActionState<
    ProposeTradeState,
    FormData
  >(proposeTrade, undefined)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <Link
        href={`/item/${requestedItem.id}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al objeto
      </Link>

      <div className="mt-4">
        <div className="flex items-center gap-3">
          <Repeat2 className="size-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Proponer trueque
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Selecciona uno de tus objetos para ofrecer a cambio de{" "}
          <strong>{requestedItem.title}</strong> de{" "}
          {requestedItem.user.name ?? "Usuario"}
        </p>
      </div>

      {state?.message && (
        <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <form action={formAction} className="mt-8 space-y-8">
        {/* Hidden: requested item id */}
        <input type="hidden" name="itemRequestedId" value={requestedItem.id} />

        {/* Requested item preview */}
        <div>
          <h2 className="text-lg font-semibold">Objeto que quieres</h2>
          <div className="mt-3 flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex size-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/50">
              {requestedItem.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={requestedItem.images[0]}
                  alt={requestedItem.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="size-6 text-muted-foreground/40" />
              )}
            </div>
            <div>
              <p className="font-medium">{requestedItem.title}</p>
              <div className="mt-1 flex gap-1.5">
                <Badge variant="secondary" className="text-xs">
                  {requestedItem.category}
                </Badge>
                {requestedItem.condition && (
                  <Badge variant="outline" className="text-xs">
                    {requestedItem.condition}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Select item to offer */}
        <div>
          <Label className="text-lg font-semibold">
            Selecciona tu objeto para ofrecer
          </Label>
          {state?.errors?.itemOfferedId && (
            <p className="mt-1 text-sm text-destructive">
              {state.errors.itemOfferedId[0]}
            </p>
          )}

          {userItems.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed p-8 text-center">
              <Package className="mx-auto size-10 text-muted-foreground/40" />
              <p className="mt-3 font-medium">No tienes objetos disponibles</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Publica un objeto primero para poder proponer un trueque.
              </p>
              <Link href="/publicar" className="mt-4 inline-block">
                <Button variant="outline" size="sm">
                  Publicar un objeto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {userItems.map((item) => (
                <label
                  key={item.id}
                  className="group relative flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 hover:bg-muted/50"
                >
                  <input
                    type="radio"
                    name="itemOfferedId"
                    value={item.id}
                    className="peer sr-only"
                  />
                  <div className="flex size-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/50">
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
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm">
                      {item.title}
                    </p>
                    <div className="mt-0.5 flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="size-4 rounded-full border-2 border-muted-foreground/30 peer-checked:border-primary peer-checked:bg-primary transition-colors">
                    <div className="size-full rounded-full scale-0 bg-primary-foreground peer-checked:scale-50 transition-transform" />
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Optional note */}
        <div className="space-y-2">
          <Label htmlFor="note">Mensaje (opcional)</Label>
          <Textarea
            id="note"
            name="note"
            placeholder="Escribe un mensaje al dueno del objeto..."
            rows={3}
            maxLength={500}
          />
          {state?.errors?.note && (
            <p className="text-sm text-destructive">{state.errors.note[0]}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={pending || userItems.length === 0}
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando propuesta...
            </>
          ) : (
            <>
              <Repeat2 className="size-5" />
              Enviar propuesta de trueque
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
