"use client"

import { useCallback, useRef, useState } from "react"
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

type ImageUploadProps = {
  /** Current image URLs (controlled state) */
  value: string[]
  /** Called when URLs change (after upload or remove) */
  onChange: (urls: string[]) => void
  /** Max number of images */
  max?: number
  /** Disable interactions */
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  max = 5,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const remaining = max - value.length
      if (remaining <= 0) {
        setError(`Maximo ${max} imagenes permitidas.`)
        return
      }

      const filesToUpload = Array.from(files).slice(0, remaining)

      // Client-side validation
      for (const file of filesToUpload) {
        if (!file.type.startsWith("image/")) {
          setError("Solo se permiten archivos de imagen.")
          return
        }
        if (file.size > 5 * 1024 * 1024) {
          setError(`"${file.name}" excede el limite de 5 MB.`)
          return
        }
      }

      setError(null)
      setUploading(true)

      try {
        const formData = new FormData()
        filesToUpload.forEach((file) => formData.append("files", file))

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error ?? "Error al subir las imagenes.")
          return
        }

        onChange([...value, ...data.urls])
      } catch {
        setError("Error de conexion. Intenta de nuevo.")
      } finally {
        setUploading(false)
        // Reset file input
        if (inputRef.current) {
          inputRef.current.value = ""
        }
      }
    },
    [max, value, onChange]
  )

  const handleRemove = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled && !uploading) {
        handleUpload(e.dataTransfer.files)
      }
    },
    [disabled, uploading, handleUpload]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return (
    <div className="space-y-3">
      {/* Thumbnail grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, i) => (
            <div
              key={url}
              className="group relative size-24 overflow-hidden rounded-lg border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="h-full w-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="size-5 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone / upload button */}
      {value.length < max && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/80 bg-muted/30 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          {uploading ? (
            <>
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Subiendo imagenes...
              </p>
            </>
          ) : (
            <>
              <ImagePlus className="size-8 text-muted-foreground/60" />
              <div>
                <p className="text-sm font-medium">
                  Arrastra imagenes aqui o
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP o AVIF. Maximo 5 MB cada una.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="size-4" />
                Seleccionar archivos
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
                disabled={disabled || uploading}
              />
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Counter */}
      <p className="text-xs text-muted-foreground">
        {value.length} de {max} imagenes
      </p>
    </div>
  )
}
