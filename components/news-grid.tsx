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
  authorName?: string  
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
  const [displayedArticles, setDisplayedArticles] = useState<ArticleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  
  const INITIAL_DISPLAY_COUNT = 9

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then((response: ArticlesApiResponse) => {
        console.log('API Response:', response);
        console.log('Sample articles with author info:', 
          response.data?.slice(0, 3).map(article => ({
            title: article.title,
            authorName: article.authorName,
            _id: article._id
          }))
        );
        
        if (response.success && response.data) {
          // Transform data từ MongoDB format sang UI format
          const transformedArticles = response.data.map(article => ({
            ...article,
            id: article._id,
            excerpt: article.shortDescription || (article.content ? article.content.substring(0, 150) + '...' : ''),
            imageUrl: article.coverImageUrl || '/placeholder.jpg',
            category: article.categoryName || 'Tin tức', // Sử dụng categoryName từ API
            author: article.authorName || 'Không rõ',  // Sử dụng authorName từ API
            publishedAt: formatTimeAgo(article.publicationDate),
            slug: article.slug || article.title?.toLowerCase().replace(/\s+/g, '-') || ''
          }));
          setArticles(transformedArticles);
          setDisplayedArticles(transformedArticles.slice(0, INITIAL_DISPLAY_COUNT));
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setError('Không thể tải dữ liệu bài báo');
        setLoading(false);
      });
  }, []);

  // Hàm xử lý khi click "Xem thêm"
  const handleShowMore = () => {
    setDisplayedArticles(articles);
    setShowAll(true);
  };

  // Hàm xử lý khi click "Thu gọn"
  const handleShowLess = () => {
    setDisplayedArticles(articles.slice(0, INITIAL_DISPLAY_COUNT));
    setShowAll(false);
  };

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
          Hiển thị {displayedArticles.length} / {articles.length} tin tức
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((article, index) => (
          <NewsCard
            key={article.id || article._id}
            id={article.id || article._id}
            title={article.title}
            excerpt={article.excerpt || ''}
            imageUrl={article.coverImageUrl || '/placeholder.jpg'}
            category={article.category || 'Tin tức'}
            author={article.author || 'Không rõ'}
            publishedAt={article.publishedAt || ''}
            featured={index === 0} 
          />
        ))}
      </div>

      {/* Nút Xem thêm / Thu gọn */}
      {articles.length > INITIAL_DISPLAY_COUNT && (
        <div className="flex justify-center mt-8">
          {!showAll ? (
            <button
              onClick={handleShowMore}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Xem thêm ({articles.length - INITIAL_DISPLAY_COUNT} bài viết)
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              Thu gọn
            </button>
          )}
        </div>
      )}
    </div>
  )
}
