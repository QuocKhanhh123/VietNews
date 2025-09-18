"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewsCard } from "@/components/news-card"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Category {
  id: string
  name: string
  slug: string
  count?: number
}

interface Article {
  _id: string
  title: string
  shortDescription: string
  coverImageUrl: string
  publicationDate: string
  views: number
  categoryId: string
  categoryName: string
  categorySlug: string
  slug?: string
}

export function CategoryTabs() {
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch categories và articles song song
      const [categoriesResponse, articlesResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/articles')
      ])

      if (!categoriesResponse.ok || !articlesResponse.ok) {
        throw new Error('Không thể tải dữ liệu')
      }

      const categoriesData = await categoriesResponse.json()
      const articlesData = await articlesResponse.json()

      console.log('Categories data:', categoriesData)
      console.log('Articles data:', articlesData)

      if (categoriesData.success && categoriesData.data) {
        // Tính số lượng bài viết cho mỗi category
        const categoriesWithCount = categoriesData.data.map((cat: Category) => {
          const count = articlesData.data?.filter((article: Article) => 
            article.categoryId === cat.id
          ).length || 0
          return { ...cat, count }
        })

        // Thêm "Tất cả" vào đầu
        const allCategories = [
          { id: "all", name: "Tất cả", slug: "all", count: articlesData.data?.length || 0 },
          ...categoriesWithCount
        ]

        setCategories(allCategories)
      }

      if (articlesData.success && articlesData.data) {
        setArticles(articlesData.data)
      }

    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Không thể tải dữ liệu danh mục')
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

  const getFilteredArticles = (categoryId: string) => {
    if (categoryId === "all") {
      return articles
    }
    return articles.filter(article => article.categoryId === categoryId)
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Đang tải danh mục...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
          {categories.slice(0, 6).map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-sm">
              {category.name}
              <span className="ml-1 text-xs text-muted-foreground">({category.count || 0})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            {(() => {
              const filteredArticles = getFilteredArticles(category.id)
              
              if (filteredArticles.length === 0) {
                return (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Chưa có tin tức nào trong danh mục {category.name}</p>
                  </div>
                )
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <NewsCard 
                      key={article._id}
                      id={article._id}
                      title={article.title}
                      excerpt={article.shortDescription || ''}
                      imageUrl={article.coverImageUrl || '/placeholder.jpg'}
                      category={article.categoryName || 'Tin tức'}
                      author="Admin"
                      publishedAt={formatTimeAgo(article.publicationDate)}
                    />
                  ))}
                </div>
              )
            })()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
