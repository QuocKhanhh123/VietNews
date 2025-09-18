"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewsCard } from "@/components/news-card"

const categories = [
  { id: "all", name: "Tất cả", count: 156 },
  { id: "thoi-su", name: "Thời sự", count: 45 },
  { id: "kinh-te", name: "Kinh tế", count: 32 },
  { id: "the-thao", name: "Thể thao", count: 28 },
  { id: "cong-nghe", name: "Công nghệ", count: 24 },
  { id: "giai-tri", name: "Giải trí", count: 27 },
]

const categoryNews = {
  "thoi-su": [
    {
      id: "ts-1",
      title: "Quốc hội thông qua luật mới về bảo vệ môi trường",
      excerpt: "Luật mới quy định các biện pháp nghiêm ngặt hơn trong việc bảo vệ môi trường và xử lý ô nhiễm.",
      imageUrl: "/vietnam-national-assembly-environment-law.jpg",
      category: "Thời sự",
      author: "Phóng viên A",
      publishedAt: "1 giờ trước",
    },
    {
      id: "ts-2",
      title: "Chủ tịch nước tiếp đón đoàn đại biểu quốc tế",
      excerpt: "Cuộc gặp nhằm thúc đẩy hợp tác song phương trong nhiều lĩnh vực quan trọng.",
      imageUrl: "/vietnam-president-international-delegation-meeting.jpg",
      category: "Thời sự",
      author: "Phóng viên B",
      publishedAt: "2 giờ trước",
    },
  ],
  "kinh-te": [
    {
      id: "kt-1",
      title: "Chỉ số VN-Index tăng mạnh trong phiên giao dịch hôm nay",
      excerpt: "Thị trường chứng khoán ghi nhận mức tăng 2.5% với thanh khoản cao.",
      imageUrl: "/vietnam-stock-market-vn-index-chart.jpg",
      category: "Kinh tế",
      author: "Chuyên gia C",
      publishedAt: "30 phút trước",
    },
    {
      id: "kt-2",
      title: "Xuất khẩu gạo Việt Nam đạt kỷ lục mới",
      excerpt: "Kim ngạch xuất khẩu gạo trong 10 tháng đầu năm đạt 3.2 tỷ USD.",
      imageUrl: "/vietnam-rice-export-record.jpg",
      category: "Kinh tế",
      author: "Chuyên gia D",
      publishedAt: "1 giờ trước",
    },
  ],
}

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="w-full">
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-sm">
              {category.name}
              <span className="ml-1 text-xs text-muted-foreground">({category.count})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="text-center text-muted-foreground py-8">
            <p>Hiển thị tất cả tin tức trong lưới bên dưới</p>
          </div>
        </TabsContent>

        {Object.entries(categoryNews).map(([categoryId, news]) => (
          <TabsContent key={categoryId} value={categoryId} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <NewsCard key={article.id} {...article} />
              ))}
            </div>
          </TabsContent>
        ))}

        {categories
          .filter((cat) => cat.id !== "all" && !categoryNews[cat.id as keyof typeof categoryNews])
          .map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="text-center text-muted-foreground py-8">
                <p>Đang cập nhật tin tức cho danh mục {category.name}</p>
              </div>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  )
}
