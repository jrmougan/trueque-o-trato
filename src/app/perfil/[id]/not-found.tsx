import Link from "next/link"
import { UserX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PerfilNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <UserX className="size-16 text-muted-foreground/40" />
      <h1 className="mt-6 text-2xl font-bold">Usuario no encontrado</h1>
      <p className="mt-2 text-muted-foreground">
        El perfil que buscas no existe.
      </p>
      <Link href="/explorar" className="mt-8">
        <Button>Explorar objetos</Button>
      </Link>
    </div>
  )
}
