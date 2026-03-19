import { Suspense } from "react"
import { Compass, PackagePlus } from "lucide-react"
import Link from "next/link"
import { getAvailableItems } from "@/services/item.service"
import { ItemCard } from "@/components/items/item-card"
import { ItemFilters } from "@/components/items/item-filters"
import { Button } from "@/components/ui/button"

export default async function ExplorarPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const categoria =
    typeof searchParams.categoria === "string"
      ? searchParams.categoria
      : undefined
  const buscar =
    typeof searchParams.buscar === "string" ? searchParams.buscar : undefined

  const items = await getAvailableItems({
    category: categoria,
    search: buscar,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Compass className="size-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Explorar objetos
          </h1>
        </div>
        <Link href="/publicar">
          <Button size="sm">
            <PackagePlus className="size-4" />
            Publicar
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <Suspense fallback={null}>
          <ItemFilters />
        </Suspense>
      </div>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <Compass className="mx-auto size-12 text-muted-foreground/40" />
          <h2 className="mt-4 text-lg font-semibold">
            No hay objetos disponibles
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {buscar || categoria
              ? "Prueba con otros filtros o busca algo diferente."
              : "Se el primero en publicar un objeto para intercambiar."}
          </p>
          {!buscar && !categoria && (
            <Link href="/publicar" className="mt-6 inline-block">
              <Button>
                <PackagePlus className="size-4" />
                Publicar un objeto
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
