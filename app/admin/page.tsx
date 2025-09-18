import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Users, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data for admin dashboard
const mockStats = {
  totalArticles: 1247,
  publishedToday: 23,
  totalViews: 892456,
  activeUsers: 15234,
}

const mockRecentArticles = [
  {
    id: 1,
    title: "Chính phủ công bố gói hỗ trợ kinh tế mới",
    status: "published",
    views: 15420,
    publishedAt: "2024-01-15T10:30:00Z",
    author: "Nguyễn Văn A",
  },
  {
    id: 2,
    title: "Đội tuyển Việt Nam chuẩn bị cho trận đấu quan trọng",
    status: "draft",
    views: 0,
    publishedAt: null,
    author: "Trần Thị B",
  },
  {
    id: 3,
    title: "Công nghệ AI trong y tế: Bước tiến mới",
    status: "published",
    views: 8932,
    publishedAt: "2024-01-15T08:15:00Z",
    author: "Lê Văn C",
  },
  {
    id: 4,
    title: "Lễ hội âm nhạc quốc tế sắp diễn ra tại Hà Nội",
    status: "scheduled",
    views: 0,
    publishedAt: "2024-01-16T14:00:00Z",
    author: "Phạm Thị D",
  },
  {
    id: 5,
    title: "Giá xăng dầu tuần này có xu hướng tăng nhẹ",
    status: "published",
    views: 12567,
    publishedAt: "2024-01-15T06:45:00Z",
    author: "Hoàng Văn E",
  },
]

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
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bảng điều khiển</h1>
          <p className="text-muted-foreground mt-1">Quản lý tin tức và nội dung website</p>
        </div>
        <Link href="/admin/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Tổng số bài viết" value={mockStats.totalArticles} icon={FileText} trend="12%" />
        <StatCard title="Đăng hôm nay" value={mockStats.publishedToday} icon={TrendingUp} trend="8%" />
        <StatCard title="Lượt xem" value={mockStats.totalViews} icon={Eye} trend="15%" />
        <StatCard title="Người dùng hoạt động" value={mockStats.activeUsers} icon={Users} trend="5%" />
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Bài viết gần đây</CardTitle>
          <CardDescription>Quản lý và theo dõi các bài viết mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentArticles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-2 sm:space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-foreground line-clamp-1">{article.title}</h3>
                    <StatusBadge status={article.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Tác giả: {article.author}</span>
                    <span>•</span>
                    <span>{article.views.toLocaleString()} lượt xem</span>
                    {article.publishedAt && (
                      <>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString("vi-VN")}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Link href={`/admin/edit/${article.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
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
        </CardContent>
      </Card>
    </div>
  )
}
