"use client"

import { useState, useEffect } from "react"
import { NewsCard } from "@/components/news-card"
import { Loader2 } from "lucide-react"

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
        <h2 className="text-2xl font-bold">Tin tức liên quan</h2>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Đang tải tin liên quan...</span>
          </div>
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
