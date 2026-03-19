"use client"

import { useActionState, useState } from "react"
import { PackagePlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ITEM_CATEGORIES } from "@/types"
import { ITEM_CONDITIONS } from "@/lib/validations/item"
import { ImageUpload } from "@/components/items/image-upload"
import { publish, type PublishState } from "./actions"

export default function PublicarPage() {
  const [state, formAction, pending] = useActionState<PublishState, FormData>(
    publish,
    undefined
  )
  const [images, setImages] = useState<string[]>([])

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <PackagePlus className="size-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Publicar objeto</h1>
      </div>
      <p className="mt-4 text-muted-foreground">
        Comparte un objeto que ya no necesitas. Alguien mas podria estar
        buscandolo.
      </p>

      {state?.message && (
        <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <form action={formAction} className="mt-10 space-y-6">
        {/* Titulo */}
        <div className="space-y-2">
          <Label htmlFor="title">Titulo del objeto</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Ej: Bicicleta de montana, Guitarra acustica..."
            aria-invalid={!!state?.errors?.title}
          />
          {state?.errors?.title && (
            <p className="text-sm text-destructive">
              {state.errors.title[0]}
            </p>
          )}
        </div>

        {/* Descripcion */}
        <div className="space-y-2">
          <Label htmlFor="description">Descripcion</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe tu objeto: estado, caracteristicas, por que lo intercambias..."
            className="min-h-28"
            aria-invalid={!!state?.errors?.description}
          />
          {state?.errors?.description && (
            <p className="text-sm text-destructive">
              {state.errors.description[0]}
            </p>
          )}
        </div>

        {/* Categoria y Condicion en grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select name="category">
              <SelectTrigger className="w-full" aria-invalid={!!state?.errors?.category}>
                <SelectValue placeholder="Selecciona categoria" />
              </SelectTrigger>
              <SelectContent>
                {ITEM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.category && (
              <p className="text-sm text-destructive">
                {state.errors.category[0]}
              </p>
            )}
          </div>

          {/* Condicion */}
          <div className="space-y-2">
            <Label>Estado del objeto</Label>
            <Select name="condition">
              <SelectTrigger className="w-full" aria-invalid={!!state?.errors?.condition}>
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                {ITEM_CONDITIONS.map((cond) => (
                  <SelectItem key={cond} value={cond}>
                    {cond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.condition && (
              <p className="text-sm text-destructive">
                {state.errors.condition[0]}
              </p>
            )}
          </div>
        </div>

        {/* Ubicacion */}
        <div className="space-y-2">
          <Label htmlFor="location">
            Ubicacion <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="location"
            name="location"
            type="text"
            placeholder="Ej: Madrid, Barcelona, CDMX..."
            aria-invalid={!!state?.errors?.location}
          />
          {state?.errors?.location && (
            <p className="text-sm text-destructive">
              {state.errors.location[0]}
            </p>
          )}
        </div>

        {/* Imagenes */}
        <div className="space-y-2">
          <Label>Imagenes</Label>
          <ImageUpload
            value={images}
            onChange={setImages}
            max={5}
            disabled={pending}
          />
          {/* Pass image URLs as hidden inputs */}
          {images.map((url, i) => (
            <input key={i} type="hidden" name="images" value={url} />
          ))}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Publicando...
            </>
          ) : (
            "Publicar objeto"
          )}
        </Button>
      </form>
    </div>
  )
}
