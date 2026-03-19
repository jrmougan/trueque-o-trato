"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeftRight,
  Compass,
  Handshake,
  LogOut,
  Menu,
  PackagePlus,
  User as UserIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/actions/auth"

type NavUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

const navigation = [
  { label: "Explorar", href: "/explorar", icon: Compass },
  { label: "Publicar Objeto", href: "/publicar", icon: PackagePlus },
  { label: "Mis Tratos", href: "/mis-tratos", icon: Handshake },
]

export function Navbar({ user }: { user?: NavUser }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeftRight className="size-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            Trueque
            <span className="text-primary"> o Trato</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.name || user.email}
              </span>
              <form action={logout}>
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="size-4" />
                  Salir
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <UserIcon className="size-4" />
                  Iniciar Sesion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrarse</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            }
          />
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-left">
                <ArrowLeftRight className="size-5 text-primary" />
                Trueque o Trato
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                )
              })}

              <div className="my-4 h-px bg-border" />

              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {user.name || user.email}
                  </div>
                  <form action={logout}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      type="submit"
                    >
                      <LogOut className="size-4" />
                      Cerrar Sesion
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <UserIcon className="size-4" />
                      Iniciar Sesion
                    </Button>
                  </Link>
                  <Link href="/register" className="mt-1">
                    <Button className="w-full">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
