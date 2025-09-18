import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NewsCard } from "@/components/news-card"

// Mock data for category pages
const categoryData = {
  "thoi-su": {
    name: "Thời sự",
    description: "Tin tức thời sự trong nước và quốc tế",
    color: "bg-red-500",
  },
  "kinh-te": {
    name: "Kinh tế",
    description: "Tin tức kinh tế, tài chính, doanh nghiệp",
    color: "bg-green-500",
  },
  "the-thao": {
    name: "Thể thao",
    description: "Tin tức thể thao trong nước và quốc tế",
    color: "bg-blue-500",
  },
  "giai-tri": {
    name: "Giải trí",
    description: "Tin tức giải trí, showbiz, văn hóa",
    color: "bg-purple-500",
  },
  "cong-nghe": {
    name: "Công nghệ",
    description: "Tin tức công nghệ, khoa học, đổi mới",
    color: "bg-cyan-500",
  },
  "suc-khoe": {
    name: "Sức khỏe",
    description: "Tin tức sức khỏe, y tế, làm đẹp",
    color: "bg-pink-500",
  },
  "giao-duc": {
    name: "Giáo dục",
    description: "Tin tức giáo dục, đào tạo, học tập",
    color: "bg-orange-500",
  },
  "du-lich": {
    name: "Du lịch",
    description: "Tin tức du lịch, khám phá, trải nghiệm",
    color: "bg-teal-500",
  },
}

const mockCategoryNews = [
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
  },
  {
    id: 2,
    title: "Ngân hàng Nhà nước điều chỉnh lãi suất cơ bản",
    description: "Quyết định mới nhằm ổn định thị trường tài chính và hỗ trợ tăng trưởng kinh tế...",
    image: "/vietnam-central-bank-interest-rate.jpg",
    category: "Kinh tế",
    publishedAt: "2024-01-15T08:15:00Z",
    readTime: "4 phút đọc",
    views: 12890,
    author: "Trần Thị B",
  },
  {
    id: 3,
    title: "Giá xăng dầu tuần này có xu hướng tăng nhẹ",
    description: "Do ảnh hưởng từ thị trường quốc tế, giá xăng dầu trong nước dự kiến tăng 200-300 đồng/lít...",
    image: "/gas-station-fuel-prices.jpg",
    category: "Kinh tế",
    publishedAt: "2024-01-15T06:45:00Z",
    readTime: "3 phút đọc",
    views: 9876,
    author: "Lê Văn C",
  },
  {
    id: 4,
    title: "Thị trường chứng khoán Việt Nam tăng điểm mạnh",
    description: "VN-Index vượt mốc 1.200 điểm nhờ dòng tiền ngoại và tâm lý tích cực của nhà đầu tư...",
    image: "/vietnam-stock-market-chart.jpg",
    category: "Kinh tế",
    publishedAt: "2024-01-14T16:20:00Z",
    readTime: "6 phút đọc",
    views: 8543,
    author: "Phạm Thị D",
  },
  {
    id: 5,
    title: "Xuất khẩu nông sản Việt Nam đạt kỷ lục mới",
    description: "Tổng kim ngạch xuất khẩu nông sản năm 2024 ước đạt 55 tỷ USD, tăng 8% so với năm trước...",
    image: "/vietnam-agricultural-export.jpg",
    category: "Kinh tế",
    publishedAt: "2024-01-14T14:10:00Z",
    readTime: "5 phút đọc",
    views: 7234,
    author: "Hoàng Văn E",
  },
  {
    id: 6,
    title: "Startup công nghệ Việt gọi vốn thành công 10 triệu USD",
    description: "Công ty khởi nghiệp về fintech vừa hoàn tất vòng gọi vốn Series A từ các quỹ đầu tư quốc tế...",
    image: "/vietnam-startup-funding-technology.jpg",
    category: "Kinh tế",
    publishedAt: "2024-01-14T11:30:00Z",
    readTime: "4 phút đọc",
    views: 6789,
    author: "Nguyễn Thị F",
  },
]

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categoryData[params.slug as keyof typeof categoryData]

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Danh mục không tồn tại</h1>
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
          <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
            <span className="text-white font-bold text-xl">{category.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{mockCategoryNews.length} bài viết</span>
          <span>•</span>
          <span>Cập nhật liên tục</span>
        </div>
      </div>

      {/* Featured Article */}
      {mockCategoryNews.length > 0 && (
        <Card className="mb-8 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={mockCategoryNews[0].image || "/placeholder.svg"}
                alt={mockCategoryNews[0].title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <Badge className="mb-3">{mockCategoryNews[0].category}</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-3 line-clamp-2">
                <Link href={`/news/${mockCategoryNews[0].id}`} className="hover:text-primary">
                  {mockCategoryNews[0].title}
                </Link>
              </h2>
              <p className="text-muted-foreground mb-4 line-clamp-3">{mockCategoryNews[0].description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Bởi {mockCategoryNews[0].author}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {mockCategoryNews[0].readTime}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {mockCategoryNews[0].views.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCategoryNews.slice(1).map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Xem thêm bài viết
        </Button>
      </div>
    </div>
  )
}
