import Link from "next/link"
import { ArrowLeftRight, Heart, Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeftRight className="size-5 text-primary" />
              <span className="text-lg font-bold tracking-tight">
                Trueque<span className="text-primary"> o Trato</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La plataforma donde el dinero no existe. Intercambia lo que tienes
              por lo que necesitas.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/explorar"
                  className="transition-colors hover:text-foreground"
                >
                  Explorar objetos
                </Link>
              </li>
              <li>
                <Link
                  href="/publicar"
                  className="transition-colors hover:text-foreground"
                >
                  Publicar un objeto
                </Link>
              </li>
              <li>
                <Link
                  href="/mis-tratos"
                  className="transition-colors hover:text-foreground"
                >
                  Mis Tratos
                </Link>
              </li>
            </ul>
          </div>

          {/* Philosophy */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <Leaf className="size-4 text-primary" />
              Nuestra filosofia
            </h3>
            <p className="text-sm text-muted-foreground">
              Creemos en una economia circular donde cada objeto tiene una
              segunda vida. Sin dinero, sin intermediarios, solo personas
              intercambiando valor real.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-border/60 pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            Hecho con <Heart className="size-3.5 fill-primary text-primary" />{" "}
            para un mundo mas sostenible
          </p>
          <p>&copy; {new Date().getFullYear()} Trueque o Trato. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
