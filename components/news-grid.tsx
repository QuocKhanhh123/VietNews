"use client"

import { useState, useEffect } from "react"
import { NewsCard } from "@/components/news-card"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Types for API response
interface ArticleData {
  _id: string
  title: string
  shortDescription: string
  content: string
  coverImageUrl: string
  publicationDate: string
  status: string
  views: number
  tags: string[]
  slug?: string
  categoryName?: string
  categorySlug?: string
  // Transformed fields for UI
  id?: string
  excerpt?: string
  imageUrl?: string
  category?: string
  author?: string
  publishedAt?: string
}

interface ArticlesApiResponse {
  success: boolean
  data: ArticleData[]
}

export function NewsGrid() {
  const [articles, setArticles] = useState<ArticleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then((response: ArticlesApiResponse) => {
        console.log('API Response:', response);
        
        if (response.success && response.data) {
          // Transform data từ MongoDB format sang UI format
          const transformedArticles = response.data.map(article => ({
            ...article,
            id: article._id,
            excerpt: article.shortDescription || (article.content ? article.content.substring(0, 150) + '...' : ''),
            imageUrl: article.coverImageUrl || '/placeholder.jpg',
            category: article.categoryName || 'Tin tức', // Sử dụng categoryName từ API
            author: 'Admin',
            publishedAt: formatTimeAgo(article.publicationDate),
            slug: article.slug || article.title?.toLowerCase().replace(/\s+/g, '-') || ''
          }));
          setArticles(transformedArticles);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setError('Không thể tải dữ liệu bài báo');
        setLoading(false);
      });
  }, []);

  // Helper function để format time ago
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
            key={article.id || article._id}
            id={article.id || article._id}
            title={article.title}
            excerpt={article.excerpt || ''}
            imageUrl={article.coverImageUrl || '/placeholder.jpg'}
            category={article.category || 'Tin tức'}
            author={article.author || 'Admin'}
            publishedAt={article.publishedAt || ''}
            featured={index === 0} 
          />
        ))}
      </div>
    </div>
  )
}
