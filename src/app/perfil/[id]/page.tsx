import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Handshake,
  Package,
  Star,
  User as UserIcon,
} from "lucide-react"
import { getUserById } from "@/services/user.service"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ItemCard } from "@/components/items/item-card"

export default async function PerfilPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  const memberSince = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(user.createdAt)

  const totalTrades = user._count.sentTrades + user._count.receivedTrades

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <Link
        href="/explorar"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a explorar
      </Link>

      {/* Profile header */}
      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "Usuario"}
              className="size-24 rounded-full object-cover"
            />
          ) : (
            <UserIcon className="size-10" />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight">
            {user.name ?? "Usuario"}
          </h1>
          {user.bio && (
            <p className="mt-2 text-muted-foreground">{user.bio}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <div className="flex items-center gap-1.5 text-sm">
              <Star className="size-4 fill-current text-amber-500" />
              <span className="font-medium">{user.karma}</span>
              <span className="text-muted-foreground">karma</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Package className="size-4 text-muted-foreground" />
              <span className="font-medium">{user._count.items}</span>
              <span className="text-muted-foreground">objetos</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Handshake className="size-4 text-muted-foreground" />
              <span className="font-medium">{totalTrades}</span>
              <span className="text-muted-foreground">tratos</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              Miembro desde {memberSince}
            </div>
          </div>
        </div>
      </div>

      {/* Karma explanation */}
      <div className="mt-8 rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <Star className="size-5 fill-current text-amber-500" />
          <h2 className="font-semibold">Sistema de Karma</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          El karma refleja la reputacion de un usuario en la comunidad. Se gana
          +1 punto de karma por cada trueque completado exitosamente. Cuanto
          mayor el karma, mas confiable es el usuario.
        </p>
        {user.karma >= 10 && (
          <Badge variant="secondary" className="mt-2">
            Miembro confiable
          </Badge>
        )}
        {user.karma >= 25 && (
          <Badge className="mt-2 ml-2">Intercambiador experto</Badge>
        )}
      </div>

      <Separator className="my-8" />

      {/* User's available items */}
      <div>
        <h2 className="text-xl font-semibold">
          Objetos disponibles ({user.items.length})
        </h2>

        {user.items.length === 0 ? (
          <div className="mt-8 text-center">
            <Package className="mx-auto size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              Este usuario no tiene objetos disponibles por el momento.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {user.items.map((item) => (
              <ItemCard
                key={item.id}
                item={{
                  ...item,
                  user: {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                    karma: user.karma,
                  },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
