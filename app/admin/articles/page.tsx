"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Edit, Trash2, Eye, Plus } from "lucide-react"
import Link from "next/link"

// Mock data for articles list
const mockArticles = [
  {
    id: 1,
    title: "Chính phủ công bố gói hỗ trợ kinh tế mới cho doanh nghiệp nhỏ",
    category: "Kinh tế",
    status: "published",
    views: 15420,
    publishedAt: "2024-01-15T10:30:00Z",
    author: "Nguyễn Văn A",
    thumbnail: "/government-economic-support-package.jpg",
  },
  {
    id: 2,
    title: "Đội tuyển Việt Nam chuẩn bị cho trận đấu quan trọng với Thái Lan",
    category: "Thể thao",
    status: "draft",
    views: 0,
    publishedAt: null,
    author: "Trần Thị B",
    thumbnail: "/vietnam-national-football-team-training.jpg",
  },
  {
    id: 3,
    title: "Công nghệ AI trong y tế: Bước tiến mới trong chẩn đoán bệnh",
    category: "Công nghệ",
    status: "published",
    views: 8932,
    publishedAt: "2024-01-15T08:15:00Z",
    author: "Lê Văn C",
    thumbnail: "/ai-medical-diagnosis-technology.jpg",
  },
  {
    id: 4,
    title: "Lễ hội âm nhạc quốc tế sắp diễn ra tại Hà Nội",
    category: "Giải trí",
    status: "scheduled",
    views: 0,
    publishedAt: "2024-01-16T14:00:00Z",
    author: "Phạm Thị D",
    thumbnail: "/international-music-festival-stage.jpg",
  },
  {
    id: 5,
    title: "Giá xăng dầu tuần này có xu hướng tăng nhẹ do ảnh hưởng thị trường quốc tế",
    category: "Kinh tế",
    status: "published",
    views: 12567,
    publishedAt: "2024-01-15T06:45:00Z",
    author: "Hoàng Văn E",
    thumbnail: "/gas-station-fuel-prices.jpg",
  },
]

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    published: { label: "Đã đăng", variant: "default" as const },
    draft: { label: "Bản nháp", variant: "secondary" as const },
    scheduled: { label: "Đã lên lịch", variant: "outline" as const },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft

  return <Badge variant={config.variant}>{config.label}</Badge>
}

export default function ArticlesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || article.status === statusFilter
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

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
          <p className="text-muted-foreground mt-1">Tổng cộng {mockArticles.length} bài viết</p>
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
                <SelectItem value="Thời sự">Thời sự</SelectItem>
                <SelectItem value="Kinh tế">Kinh tế</SelectItem>
                <SelectItem value="Thể thao">Thể thao</SelectItem>
                <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                <SelectItem value="Giải trí">Giải trí</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Thumbnail */}
                <div className="w-full lg:w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={article.thumbnail || "/placeholder.svg"}
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
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Tác giả: {article.author}</span>
                    <span>•</span>
                    <span>{article.views.toLocaleString()} lượt xem</span>
                    {article.publishedAt && (
                      <>
                        <span>•</span>
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString("vi-VN", {
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
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Xem
                    </Button>
                    <Link href={`/admin/edit/${article.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Không tìm thấy bài viết nào phù hợp với bộ lọc.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
