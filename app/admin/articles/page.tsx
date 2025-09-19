"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Edit, Trash2, Eye, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

interface Article {
  _id: string
  title: string
  slug: string
  shortDescription: string
  content: string
  coverImageUrl: string
  publicationDate: string
  updatedAt: string
  status: 'published' | 'draft'
  views: number
  tags: string[]
  categoryName: string
  categorySlug: string
  authorName: string
  authorId: string
  categoryId: string
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    published: { label: "Đã đăng", variant: "default" as const },
    draft: { label: "Bản nháp", variant: "secondary" as const },
    scheduled: { label: "Đã lên lịch", variant: "outline" as const },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft

  return <Badge variant={config.variant}>{config.label}</Badge>
}

interface Category {
  _id: string
  name: string
  slug: string
}

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Fetch user's articles and categories
  useEffect(() => {
    fetchData()
  }, [])

  // Refetch when filters change
  useEffect(() => {
    if (!isLoading) {
      fetchArticles()
    }
  }, [statusFilter, categoryFilter, searchTerm])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([fetchArticles(), fetchCategories()])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchArticles = async () => {
    try {
      // Build query parameters
      const params = new URLSearchParams()
      
      // Get current user from localStorage and add their ID
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        if (user.id) {
          params.append('authorId', user.id)
        }
      }
      
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (searchTerm.trim()) params.append('search', searchTerm.trim())

      const response = await fetch(`/api/articles/user?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setArticles(data.data)
      } else {
        setError(data.error || 'Không thể tải danh sách bài viết')
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      setError('Có lỗi xảy ra khi tải bài viết')
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return

    try {
      // Get current user from localStorage
      const userData = localStorage.getItem('user')
      if (!userData) {
        setError('Không tìm thấy thông tin người dùng')
        return
      }

      const user = JSON.parse(userData)
      if (!user.id) {
        setError('Không tìm thấy ID người dùng')
        return
      }

      const response = await fetch(`/api/articles/${articleId}?authorId=${user.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        // Remove from local state
        setArticles(prev => prev.filter(article => article._id !== articleId))
        console.log('Xóa bài viết thành công')
      } else {
        setError(data.error || 'Có lỗi xảy ra khi xóa bài viết')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      setError('Có lỗi xảy ra khi xóa bài viết')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Quản lý bài viết</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? 'Đang tải...' : `Tổng cộng ${articles.length} bài viết`}
          </p>
          {error && (
            <div className="bg-destructive/15 text-destructive px-3 py-2 rounded-lg mt-2 text-sm">
              {error}
            </div>
          )}
        </div>
        <Link href="/admin/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Đã đăng</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="scheduled">Đã lên lịch</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Đang tải danh sách bài viết...</p>
            </CardContent>
          </Card>
        ) : (
          articles.map((article) => (
            <Card key={article._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="w-full lg:w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={article.coverImageUrl || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">{article.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={article.status} />
                        <Badge variant="outline">{article.categoryName}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Tác giả: {article.authorName}</span>
                      <span>•</span>
                      <span>{article.views.toLocaleString()} lượt xem</span>
                      {article.publicationDate && new Date(article.publicationDate).getTime() > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {new Date(article.publicationDate).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Link href={`/news/${article._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem
                        </Button>
                      </Link>
                      <Link href={`/admin/edit/${article._id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Sửa
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteArticle(article._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!isLoading && articles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                ? 'Không tìm thấy bài viết nào phù hợp với bộ lọc.'
                : 'Bạn chưa có bài viết nào. Hãy tạo bài viết đầu tiên!'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
