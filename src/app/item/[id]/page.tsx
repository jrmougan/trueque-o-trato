import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Repeat2,
  Star,
  User as UserIcon,
} from "lucide-react"
import { auth } from "@/lib/auth"
import { getItemById } from "@/services/item.service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function ItemDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const item = await getItemById(id)

  if (!item) {
    notFound()
  }

  const session = await auth()
  const isOwner = session?.user?.id === item.userId

  const createdAtFormatted = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(item.createdAt)

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

      <div className="mt-4 grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Left column: Images */}
        <div>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-muted/50">
            {item.images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.images[0]}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
                <Package className="size-16" />
                <span className="text-sm">Sin imagenes</span>
              </div>
            )}
          </div>

          {/* Thumbnail strip for multiple images (future) */}
          {item.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {item.images.map((img, i) => (
                <div
                  key={i}
                  className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${item.title} - imagen ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Details */}
        <div>
          {/* Status badge (if not available) */}
          {item.status !== "AVAILABLE" && (
            <Badge variant="destructive" className="mb-3">
              {item.status === "TRADED" ? "Intercambiado" : "Oculto"}
            </Badge>
          )}

          <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>

          {/* Category & Condition badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">{item.category}</Badge>
            {item.condition && (
              <Badge variant="outline">{item.condition}</Badge>
            )}
          </div>

          {/* Location */}
          {item.location && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {item.location}
            </div>
          )}

          {/* Date */}
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            Publicado el {createdAtFormatted}
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold">Descripcion</h2>
            <p className="mt-2 whitespace-pre-line text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          <Separator className="my-6" />

          {/* Owner info */}
          <div>
            <h2 className="text-lg font-semibold">Publicado por</h2>
            <Link
              href={`/perfil/${item.user.id}`}
              className="mt-3 flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {item.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.user.image}
                    alt={item.user.name ?? "Usuario"}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="size-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.user.name ?? "Usuario"}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-3.5 fill-current text-amber-500" />
                  <span>{item.user.karma} karma</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Action buttons */}
          <div className="mt-8">
            {isOwner ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" className="flex-1" disabled>
                  Editar (proximamente)
                </Button>
              </div>
            ) : item.status === "AVAILABLE" ? (
              <Link href={`/proponer-trueque/${item.id}`}>
                <Button size="lg" className="w-full">
                  <Repeat2 className="size-5" />
                  Proponer trueque
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="w-full" disabled>
                Este objeto ya no esta disponible
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
