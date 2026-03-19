import Link from "next/link"
import { PackageX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ItemNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <PackageX className="size-16 text-muted-foreground/40" />
      <h1 className="mt-6 text-2xl font-bold">Objeto no encontrado</h1>
      <p className="mt-2 text-muted-foreground">
        El objeto que buscas no existe o fue eliminado.
      </p>
      <Link href="/explorar" className="mt-8">
        <Button>Explorar objetos</Button>
      </Link>
    </div>
  )
}
