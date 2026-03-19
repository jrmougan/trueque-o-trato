import Link from "next/link"
import { MapPin, Package } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ItemCardProps = {
  id: string
  title: string
  description: string
  category: string
  condition: string | null
  location: string | null
  images: string[]
  user: {
    id: string
    name: string | null
    image: string | null
    karma: number
  }
  createdAt: Date
}

export function ItemCard({ item }: { item: ItemCardProps }) {
  return (
    <Link href={`/item/${item.id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        {/* Image placeholder */}
        <div className="flex h-40 items-center justify-center bg-muted/50">
          {item.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.images[0]}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package className="size-10 text-muted-foreground/40" />
          )}
        </div>

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1">{item.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">{item.category}</Badge>
            {item.condition && (
              <Badge variant="outline">{item.condition}</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </CardContent>

        <CardFooter className="justify-between">
          <span className="text-xs text-muted-foreground">
            {item.user.name ?? "Usuario"}
          </span>
          {item.location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {item.location}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
