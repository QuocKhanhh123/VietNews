import { NewsCard } from "@/components/news-card"

interface RelatedNewsProps {
  currentNewsId: string
  category: string
}

// Mock related news data
const relatedNewsData = [
  {
    id: "related-1",
    title: "Ngân hàng Nhà nước điều chỉnh lãi suất cơ bản",
    excerpt: "Quyết định nhằm hỗ trợ doanh nghiệp tiếp cận vốn dễ dàng hơn trong bối cảnh kinh tế phục hồi.",
    imageUrl: "/vietnam-central-bank-interest-rate.jpg",
    category: "Kinh tế",
    author: "Chuyên gia E",
    publishedAt: "4 giờ trước",
  },
  {
    id: "related-2",
    title: "Startup Việt Nam thu hút 2 tỷ USD vốn đầu tư trong năm 2024",
    excerpt: "Con số ấn tượng cho thấy sự phát triển mạnh mẽ của hệ sinh thái khởi nghiệp trong nước.",
    imageUrl: "/vietnam-startup-investment-2024.jpg",
    category: "Kinh tế",
    author: "Chuyên gia F",
    publishedAt: "6 giờ trước",
  },
  {
    id: "related-3",
    title: "Thương mại điện tử Việt Nam tăng trưởng 25% trong quý III",
    excerpt: "Sự phát triển của thương mại điện tử tiếp tục là động lực quan trọng cho nền kinh tế số.",
    imageUrl: "/vietnam-ecommerce-growth-q3.jpg",
    category: "Kinh tế",
    author: "Chuyên gia G",
    publishedAt: "8 giờ trước",
  },
]

export function RelatedNews({ currentNewsId, category }: RelatedNewsProps) {
  // Filter out current news and get related news by category
  const relatedNews = relatedNewsData.filter((news) => news.id !== currentNewsId && news.category === category)

  if (relatedNews.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tin tức liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedNews.map((news) => (
          <NewsCard key={news.id} {...news} />
        ))}
      </div>
    </div>
  )
}
