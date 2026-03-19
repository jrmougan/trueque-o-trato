import Link from "next/link"
import {
  ArrowLeftRight,
  Compass,
  Leaf,
  PackagePlus,
  Recycle,
  ShieldCheck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute right-0 top-0 -z-10 size-[500px] translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 size-[400px] -translate-x-1/3 translate-y-1/4 rounded-full bg-sage/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Leaf className="size-4" />
            Economia circular, 100% sin dinero
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Intercambia sin dinero.
            <br />
            <span className="text-primary">Solo trueque.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Dale una segunda vida a lo que ya no usas. En{" "}
            <strong className="text-foreground">Trueque o Trato</strong>, el
            dinero esta estrictamente prohibido. Aqui solo vale lo que ofreces y
            lo que necesitas.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/explorar">
              <Button size="lg" className="gap-2 text-base">
                <Compass className="size-5" />
                Explorar objetos
              </Button>
            </Link>
            <Link href="/publicar">
              <Button variant="outline" size="lg" className="gap-2 text-base">
                <PackagePlus className="size-5" />
                Publicar un objeto
              </Button>
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Como funciona
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <HowItWorksCard
              icon={PackagePlus}
              title="1. Publica"
              description="Sube los objetos que ya no necesitas. Agrega fotos, descripcion y la categoria."
            />
            <HowItWorksCard
              icon={Compass}
              title="2. Explora"
              description="Busca entre cientos de objetos publicados por otros usuarios. Encuentra lo que necesitas."
            />
            <HowItWorksCard
              icon={ArrowLeftRight}
              title="3. Intercambia"
              description="Propone un trueque. Si ambas partes aceptan, el intercambio se completa. Sin dinero."
            />
          </div>
        </div>

        {/* Values */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <ValueCard
              icon={Recycle}
              title="Sostenibilidad"
              description="Cada trueque es un objeto menos en el vertedero. Contribuye a un planeta mas limpio."
            />
            <ValueCard
              icon={Users}
              title="Comunidad"
              description="Conecta con personas de tu zona. El trueque fortalece los lazos comunitarios."
            />
            <ValueCard
              icon={ShieldCheck}
              title="Confianza"
              description="Sistema de karma y reputacion. Intercambia con seguridad y transparencia."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="relative rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="size-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-muted/50 p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
