"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Users, FileText, TrendingUp, Loader2, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

interface Stats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  publishedToday: number
  totalViews: number
  statusBreakdown: Record<string, number>
}

// Fallback stats in case API fails
const fallbackStats = {
  totalArticles: 0,
  publishedArticles: 0,
  draftArticles: 0,
  publishedToday: 0,
  totalViews: 0,
  statusBreakdown: {}
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string
  value: string | number
  icon: any
  trend?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+{trend}</span> từ tháng trước
          </p>
        )}
      </CardContent>
    </Card>
  )
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

export default function AdminDashboard() {
  const router = useRouter()
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [stats, setStats] = useState<Stats>(fallbackStats)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Fetch data on component mount
  useEffect(() => {
    // Get current user info
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
    
    Promise.all([fetchRecentArticles(), fetchStats()])
  }, [])

  const fetchStats = async () => {
    setIsLoadingStats(true)
    
    try {
      // Get current user from localStorage
      const userData = localStorage.getItem('user')
      let apiUrl = '/api/articles/stats'
      
      if (userData) {
        const user = JSON.parse(userData)
        if (user.id) {
          // Pass the current user's ID to get their specific stats
          apiUrl = `/api/articles/stats?authorId=${user.id}`
        }
      }
      
      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        console.error('Error fetching stats:', data.error)
        // Keep fallback stats if API fails
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Keep fallback stats if API fails
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchRecentArticles = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      // Get current user from localStorage
      const userData = localStorage.getItem('user')
      let apiUrl = '/api/articles/user'
      
      if (userData) {
        const user = JSON.parse(userData)
        if (user.id) {
          // Pass the current user's ID to get their specific articles
          apiUrl = `/api/articles/user?authorId=${user.id}`
        }
      }
      
      // Fetch latest 5 articles from the user
      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.success) {
        // Take only the first 5 articles for the dashboard
        setRecentArticles(data.data.slice(0, 5))
      } else {
        setError(data.error || 'Không thể tải danh sách bài viết')
      }
    } catch (error) {
      console.error('Error fetching recent articles:', error)
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return

    setDeletingId(articleId)
    setError("")
    setSuccessMessage("")

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
        // Remove from local state only after successful API call
        setRecentArticles(prev => prev.filter(article => article._id !== articleId))
        
        // Also refresh stats to update counters
        fetchStats()
        
        // Show success message
        setSuccessMessage('Xóa bài viết thành công!')
        setTimeout(() => setSuccessMessage(''), 3000) // Clear after 3 seconds
      } else {
        setError(data.error || 'Có lỗi xảy ra khi xóa bài viết')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      setError('Có lỗi xảy ra khi xóa bài viết')
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    // Redirect to home page
    router.push('/')
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bảng điều khiển</h1>
          <p className="text-muted-foreground mt-1">
            Chào mừng {currentUser?.fullname || currentUser?.email || 'Admin'} - Quản lý tin tức và nội dung website
          </p>
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-lg mt-2">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mt-2">
              {successMessage}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tạo bài viết mới
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng số bài viết" 
          value={isLoadingStats ? "..." : stats.totalArticles} 
          icon={FileText} 
        />
        <StatCard 
          title="Đã xuất bản" 
          value={isLoadingStats ? "..." : stats.publishedArticles} 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Bản nháp" 
          value={isLoadingStats ? "..." : stats.draftArticles} 
          icon={Edit} 
        />
        <StatCard 
          title="Tổng lượt xem" 
          value={isLoadingStats ? "..." : stats.totalViews} 
          icon={Eye} 
        />
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Bài viết gần đây</CardTitle>
          <CardDescription>
            Quản lý và theo dõi các bài viết mới nhất của bạn
            {error && (
              <div className="bg-destructive/15 text-destructive px-3 py-2 rounded-lg mt-2 text-sm">
                {error}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span className="text-muted-foreground">Đang tải bài viết...</span>
            </div>
          ) : recentArticles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Bạn chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
              </p>
              <Link href="/admin/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo bài viết mới
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div
                    key={article._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2 sm:space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-foreground line-clamp-1">{article.title}</h3>
                        <StatusBadge status={article.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Tác giả: {article.authorName}</span>
                        <span>•</span>
                        <span>{article.views.toLocaleString()} lượt xem</span>
                        <span>•</span>
                        <span>Danh mục: {article.categoryName}</span>
                        {article.publicationDate && new Date(article.publicationDate).getTime() > 0 && (
                          <>
                            <span>•</span>
                            <span>{new Date(article.publicationDate).toLocaleDateString("vi-VN")}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 sm:mt-0">
                      <Link href={`/news/${article._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/edit/${article._id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteArticle(article._id)}
                        disabled={deletingId === article._id}
                      >
                        {deletingId === article._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/admin/articles">
                  <Button variant="outline">Xem tất cả bài viết</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
