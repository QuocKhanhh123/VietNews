import Image from "next/image"
import Link from "next/link"
import { Clock, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  category: string
  author: string
  publishedAt: string
  featured?: boolean
}

export function NewsCard({
  id,
  title,
  excerpt,
  imageUrl,
  category,
  author,
  publishedAt,
  featured = false,
}: NewsCardProps) {
  const cardClass = featured ? "md:col-span-2 md:row-span-2" : ""
  const imageHeight = featured ? "h-64 md:h-80" : "h-48"
  const titleSize = featured ? "text-xl md:text-2xl" : "text-lg"

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-300 ${cardClass}`}>
      <Link href={`/news/${id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={600}
            height={400}
            className={`w-full ${imageHeight} object-cover group-hover:scale-105 transition-transform duration-300`}
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3
            className={`font-bold ${titleSize} line-clamp-2 group-hover:text-primary transition-colors mb-2 text-balance`}
          >
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 text-pretty">{excerpt}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{publishedAt}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
