"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ITEM_CATEGORIES } from "@/types"
import { cn } from "@/lib/utils"

export function ItemFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("categoria") ?? ""
  const currentSearch = searchParams.get("buscar") ?? ""

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/explorar?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          updateParams("buscar", formData.get("buscar") as string)
        }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="buscar"
          type="text"
          placeholder="Buscar objetos..."
          defaultValue={currentSearch}
          className="pl-9"
        />
      </form>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={currentCategory === "" ? "default" : "outline"}
          size="sm"
          onClick={() => updateParams("categoria", "")}
        >
          Todos
        </Button>
        {ITEM_CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={currentCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() =>
              updateParams("categoria", currentCategory === cat ? "" : cat)
            }
            className={cn(
              currentCategory === cat && "bg-primary text-primary-foreground"
            )}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  )
}
