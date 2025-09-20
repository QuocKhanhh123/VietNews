"use client"

import { useState, useEffect } from "react"
import { NewsCard } from "@/components/news-card"
import { Skeleton } from "@/components/ui/skeleton"

interface RelatedNewsProps {
  currentNewsId: string
  category: string
}

interface ArticleData {
  _id: string
  title: string
  shortDescription: string
  coverImageUrl: string
  publicationDate: string
  views: number
  tags: string[]
  slug?: string
  authorName?: string
  categoryName?: string
}

export function RelatedNews({ currentNewsId, category }: RelatedNewsProps) {
  const [relatedNews, setRelatedNews] = useState<ArticleData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedNews()
  }, [currentNewsId, category])

  const fetchRelatedNews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/articles')
      const data = await response.json()
      
      if (data.data) {
        // Filter out current article and get random 3 articles
        const filtered = data.data
          .filter((article: ArticleData) => article._id !== currentNewsId)
          .slice(0, 3)
        
        setRelatedNews(filtered)
      }
    } catch (error) {
      console.error('Error fetching related news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (date: any): string => {
    if (!date) return 'Chưa rõ';
    const now = new Date();
    const publishDate = new Date(date);
    const diffInMs = now.getTime() - publishDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return publishDate.toLocaleDateString('vi-VN');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-blue-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-4">
              {/* Image skeleton */}
              <Skeleton className="h-48 w-full rounded-lg bg-blue-100" />
              
              {/* Category badge skeleton */}
              <Skeleton className="h-5 w-20 bg-blue-100" />
              
              {/* Title skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-full bg-blue-100" />
                <Skeleton className="h-6 w-3/4 bg-blue-100" />
              </div>
              
              {/* Excerpt skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-blue-100" />
                <Skeleton className="h-4 w-full bg-blue-100" />
                <Skeleton className="h-4 w-2/3 bg-blue-100" />
              </div>
              
              {/* Meta info skeleton */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 bg-blue-100" />
                <Skeleton className="h-4 w-20 bg-blue-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedNews.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tin tức liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedNews.map((article) => (
          <NewsCard 
            key={article._id}
            id={article._id}
            title={article.title}
            excerpt={article.shortDescription || ''}
            imageUrl={article.coverImageUrl || '/placeholder.jpg'}
            category={article.categoryName || "Tin tức"}
            author={article.authorName || "Không rõ"}
            publishedAt={formatTimeAgo(article.publicationDate)}
          />
        ))}
      </div>
    </div>
  )
}
