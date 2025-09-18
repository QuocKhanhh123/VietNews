"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const featuredNews = [
  {
    id: "featured-1",
    title: "Việt Nam ký kết thỏa thuận hợp tác kinh tế quan trọng với EU",
    excerpt:
      "Thỏa thuận mở ra cơ hội xuất khẩu lớn cho các doanh nghiệp Việt Nam, đặc biệt trong lĩnh vực nông sản và công nghiệp chế biến.",
    imageUrl: "/vietnam-eu-economic-cooperation-signing-ceremony.jpg",
    category: "Thời sự",
    author: "Báo chí VietNews",
    publishedAt: "1 giờ trước",
  },
  {
    id: "featured-2",
    title: "Khám phá công nghệ blockchain trong ngành ngân hàng Việt Nam",
    excerpt:
      "Các ngân hàng lớn đang triển khai ứng dụng blockchain để tăng cường bảo mật và minh bạch trong các giao dịch tài chính.",
    imageUrl: "/blockchain-technology-banking-vietnam.jpg",
    category: "Công nghệ",
    author: "Chuyên gia Tech",
    publishedAt: "2 giờ trước",
  },
  {
    id: "featured-3",
    title: "Mùa lễ hội cuối năm: Điểm đến du lịch hấp dẫn nhất Việt Nam",
    excerpt:
      "Từ Sapa tuyết trắng đến Phú Quốc nắng vàng, khám phá những điểm đến tuyệt vời cho kỳ nghỉ cuối năm của bạn.",
    imageUrl: "/vietnam-tourism-destinations-winter-festival.jpg",
    category: "Du lịch",
    author: "Travel Guide VN",
    publishedAt: "3 giờ trước",
  },
]

export function FeaturedNews() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length)
  }

  // Go to specific slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentNews = featuredNews[currentSlide]

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "400px",
        color: "#ffffff",
      }}
    >
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src={currentNews.imageUrl || "/placeholder.svg"}
          alt={currentNews.title}
          fill
          className="object-cover"
          priority
        />

        {/* Multiple overlay layers for maximum darkness */}
        <div
          className="absolute inset-0"
          
        />
        <div
          className="absolute inset-0"
          
        />

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hover:bg-black/80 transition-colors"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
          onClick={prevSlide}
          type="button"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hover:bg-black/80 transition-colors"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
          onClick={nextSlide}
          type="button"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Content with dark background */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
          
        >
          <div className="max-w-3xl">
            <Badge
              className="mb-4 border-0 shadow-lg"
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
              }}
            >
              {currentNews.category}
            </Badge>
            <Link href={`/news/${currentNews.id}`}>
              <h1
                className="text-2xl md:text-4xl font-bold mb-4 hover:opacity-80 transition-opacity text-balance"
                style={{
                  color: "#ffffff !important",
                  textShadow: "2px 2px 4px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8)",
                  backgroundColor: "transparent !important",
                }}
              >
                {currentNews.title}
              </h1>
            </Link>
            <p
              className="text-lg mb-4 line-clamp-2 text-pretty"
              style={{
                color: "#ffffff !important",
                textShadow: "1px 1px 3px rgba(0,0,0,1)",
                backgroundColor: "transparent !important",
              }}
            >
              {currentNews.excerpt}
            </p>
            <div
              className="flex items-center space-x-4 text-sm"
              style={{
                color: "#ffffff !important",
                textShadow: "1px 1px 2px rgba(0,0,0,1)",
                backgroundColor: "transparent !important",
              }}
            >
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{currentNews.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{currentNews.publishedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-6 flex space-x-2 z-10">
        {featuredNews.map((_, index) => (
          <button
            key={index}
            className="w-3 h-3 rounded-full transition-colors hover:scale-110 cursor-pointer"
            style={{
              backgroundColor: index === currentSlide ? "#ffffff" : "rgba(255,255,255,0.5)",
              border: "2px solid rgba(255,255,255,0.7)",
            }}
            onClick={() => goToSlide(index)}
            type="button"
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
