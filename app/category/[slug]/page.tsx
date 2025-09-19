"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { NewsCard } from "@/components/news-card"
import { useState, useEffect } from "react"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface Article {
  _id: string
  title: string
  slug: string
  shortDescription: string
  content: string
  coverImageUrl: string
  publicationDate: string
  updatedAt: string
  status: string
  views: number
  tags: string[]
  categoryId: string
  categoryName: string
  categorySlug: string
}

// Fallback category colors
const categoryColors = {
  "thoi-su": "bg-red-500",
  "kinh-te": "bg-green-500",
  "the-thao": "bg-blue-500",
  "giai-tri": "bg-purple-500",
  "cong-nghe": "bg-cyan-500",
  "suc-khoe": "bg-pink-500",
  "giao-duc": "bg-orange-500",
  "du-lich": "bg-teal-500",
}

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategoryData()
  }, [params.slug])

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch categories để tìm category hiện tại
      const categoriesResponse = await fetch('/api/categories')
      const categoriesData = await categoriesResponse.json()

      if (!categoriesData.success) {
        throw new Error('Không thể tải danh mục')
      }

      // Tìm category theo slug
      const foundCategory = categoriesData.data.find((cat: Category) => cat.slug === params.slug)
      
      if (!foundCategory) {
        setError('Danh mục không tồn tại')
        return
      }

      setCategory(foundCategory)

      // Fetch articles
      const articlesResponse = await fetch('/api/articles')
      const articlesData = await articlesResponse.json()

      if (!articlesData.success) {
        throw new Error('Không thể tải bài viết')
      }

      // Filter articles theo category slug
      const filteredArticles = articlesData.data.filter((article: Article) => 
        article.categorySlug === params.slug
      )

      setArticles(filteredArticles)

    } catch (error) {
      console.error('Error fetching category data:', error)
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Đang tải danh mục...</p>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {error || 'Danh mục không tồn tại'}
        </h1>
        <Link href="/">
          <Button>Về trang chủ</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Về trang chủ
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-lg ${categoryColors[params.slug as keyof typeof categoryColors] || 'bg-gray-500'} flex items-center justify-center`}>
            <span className="text-white font-bold text-xl">{category.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
            <p className="text-muted-foreground">Tin tức {category.name.toLowerCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{articles.length} bài viết</span>
          <span>•</span>
          <span>Cập nhật liên tục</span>
        </div>
      </div>

      {/* No articles message */}
      {articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">Chưa có bài viết nào trong danh mục này.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Về trang chủ</Button>
          </Link>
        </div>
      )}

      {/* Articles Grid - 3 columns layout */}
      {articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {articles.map((article) => (
            <NewsCard 
              key={article._id}
              id={article._id}
              title={article.title}
              excerpt={article.shortDescription}
              imageUrl={article.coverImageUrl || "/placeholder.svg"}
              category={article.categoryName}
              author="VietNews"
              publishedAt={new Date(article.publicationDate).toLocaleDateString('vi-VN')}
            />
          ))}
        </div>
      )}

      {/* Load More Button - For future pagination */}
      {articles.length > 6 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm bài viết
          </Button>
        </div>
      )}
    </div>
  )
}
