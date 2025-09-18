"use client"

import { useState, useEffect } from "react"
import { NewsCard } from "@/components/news-card"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Types for API response
interface ArticleData {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  category: string
  author: string
  publishedAt: string
  slug: string
  views: number
}

interface ArticlesApiResponse {
  articles: ArticleData[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export function NewsGrid() {
  const [articles, setArticles] = useState<ArticleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then((data: ArticlesApiResponse) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setError('Không thể tải dữ liệu bài báo');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải tin tức...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Chưa có bài báo nào
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Tin tức mới nhất
        </h2>
        <div className="text-sm text-muted-foreground">
          Hiển thị {articles.length} tin tức
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard
            key={article.id}
            id={article.id}
            title={article.title}
            excerpt={article.excerpt}
            imageUrl={article.imageUrl}
            category={article.category}
            author={article.author}
            publishedAt={article.publishedAt}
            featured={index === 0} 
          />
        ))}
      </div>
    </div>
  )
}
