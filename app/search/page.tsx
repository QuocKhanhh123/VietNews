"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NewsCard } from "@/components/news-card"

// Mock search results
const mockSearchResults = [
  {
    id: 1,
    title: "Chính phủ công bố gói hỗ trợ kinh tế mới cho doanh nghiệp nhỏ",
    description: "Gói hỗ trợ trị giá 50.000 tỷ đồng nhằm giúp các doanh nghiệp nhỏ và vừa vượt qua khó khăn...",
    image: "/government-economic-support-package.jpg",
    category: "Kinh tế",
    publishedAt: "2024-01-15T10:30:00Z",
    readTime: "5 phút đọc",
    views: 15420,
    author: "Nguyễn Văn A",
    relevance: 95,
  },
  {
    id: 2,
    title: "Công nghệ AI trong y tế: Bước tiến mới trong chẩn đoán bệnh",
    description: "Các ứng dụng trí tuệ nhân tạo đang cách mạng hóa ngành y tế với độ chính xác cao...",
    image: "/ai-medical-diagnosis-technology.jpg",
    category: "Công nghệ",
    publishedAt: "2024-01-15T08:15:00Z",
    readTime: "6 phút đọc",
    views: 8932,
    author: "Lê Văn C",
    relevance: 88,
  },
  {
    id: 3,
    title: "Đội tuyển Việt Nam chuẩn bị cho trận đấu quan trọng với Thái Lan",
    description: "HLV Park Hang-seo đã có những điều chỉnh chiến thuật quan trọng cho trận đấu sắp tới...",
    image: "/vietnam-national-football-team-training.jpg",
    category: "Thể thao",
    publishedAt: "2024-01-15T06:45:00Z",
    readTime: "4 phút đọc",
    views: 12567,
    author: "Trần Thị B",
    relevance: 82,
  },
  {
    id: 4,
    title: "Lễ hội âm nhạc quốc tế sắp diễn ra tại Hà Nội",
    description: "Sự kiện âm nhạc lớn nhất năm với sự tham gia của nhiều nghệ sĩ quốc tế nổi tiếng...",
    image: "/international-music-festival-stage.jpg",
    category: "Giải trí",
    publishedAt: "2024-01-14T16:20:00Z",
    readTime: "3 phút đọc",
    views: 7890,
    author: "Phạm Thị D",
    relevance: 75,
  },
]

const categories = [
  "Tất cả",
  "Thời sự",
  "Kinh tế",
  "Thể thao",
  "Công nghệ",
  "Giải trí",
  "Sức khỏe",
  "Giáo dục",
  "Du lịch",
]
const sortOptions = [
  { value: "relevance", label: "Liên quan nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "most-viewed", label: "Xem nhiều nhất" },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [sortBy, setSortBy] = useState("relevance")
  const [results, setResults] = useState(mockSearchResults)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      // Filter results based on query (mock implementation)
      const filtered = mockSearchResults.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase()) ||
          article.author.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered)
      setIsLoading(false)
    }, 500)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
      // Update URL
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const filteredResults = results.filter((article) => {
    if (selectedCategory === "Tất cả") return true
    return article.category === selectedCategory
  })

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      case "most-viewed":
        return b.views - a.views
      case "relevance":
      default:
        return b.relevance - a.relevance
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Về trang chủ
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Tìm kiếm tin tức</h1>
        {searchQuery && (
          <p className="text-muted-foreground">
            Kết quả cho: <span className="font-medium text-foreground">"{searchQuery}"</span>
          </p>
        )}
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Nhập từ khóa tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang tìm..." : "Tìm kiếm"}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Lọc:</span>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {searchQuery && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Tìm thấy <span className="font-medium text-foreground">{sortedResults.length}</span> kết quả
            {selectedCategory !== "Tất cả" && (
              <span>
                {" "}
                trong danh mục <Badge variant="outline">{selectedCategory}</Badge>
              </span>
            )}
          </p>
        </div>
      )}

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResults.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : searchQuery ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Không tìm thấy kết quả</h3>
            <p className="text-muted-foreground mb-4">Không có bài viết nào phù hợp với từ khóa "{searchQuery}"</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Gợi ý:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Kiểm tra lại chính tả</li>
                <li>Thử sử dụng từ khóa khác</li>
                <li>Sử dụng từ khóa ngắn gọn hơn</li>
                <li>Thử tìm kiếm trong danh mục khác</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Tìm kiếm tin tức</h3>
            <p className="text-muted-foreground">Nhập từ khóa để tìm kiếm bài viết</p>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {sortedResults.length > 0 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm kết quả
          </Button>
        </div>
      )}
    </div>
  )
}
