"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, User, Bookmark, Eye, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RelatedNews } from "@/components/related-news"
import { ShareButtons } from "@/components/share-buttons"

interface ArticleDetail {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  imageUrl: string
  category: string
  author: string
  publishedAt: string
  updatedAt: string
  views: number
  tags: string[]
}

interface NewsDetailPageProps {
  params: {
    id: string
  }
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchArticle(params.id)
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching article with ID:', id) // Debug log

      const response = await fetch(`/api/articles/${id}`)
      
      console.log('Response status:', response.status) // Debug log
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Bài viết không tồn tại')
        }
        throw new Error('Không thể tải bài viết')
      }

      const data: ArticleDetail = await response.json()
      console.log('Received data:', data) // Debug log
      setArticle(data)

    } catch (err) {
      console.error('Error fetching article:', err)
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Đang tải bài viết...</span>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="flex gap-4">
                <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                <Button onClick={() => fetchArticle(params.id)}>
                  Thử lại
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại trang chủ
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {article.category}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-balance leading-tight">{article.title}</h1>

            <p className="text-lg text-muted-foreground mb-6 text-pretty leading-relaxed">{article.excerpt}</p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Tác giả: {article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Đăng lúc: {formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{article.views.toLocaleString()} lượt xem</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{calculateReadTime(article.content)} phút đọc</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-6">
              <ShareButtons title={article.title} url={`/news/${article.id}`} />
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Lưu bài viết
              </Button>
            </div>

            <Separator />
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              lineHeight: "1.7",
              fontSize: "18px",
            }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-3">Từ khóa:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Article Footer */}
          <footer className="border-t pt-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
              <div>
                <p>Cập nhật lần cuối: {formatDate(article.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <ShareButtons title={article.title} url={`/news/${article.id}`} />
              </div>
            </div>
          </footer>
        </article>

        {/* Related News */}
        <section className="container mx-auto px-4 py-8 max-w-6xl">
          <RelatedNews currentNewsId={article.id} category={article.category} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
