"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PenTool, User, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"

export default function PostNewsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status and user role
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // Check if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Lock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Yêu cầu đăng nhập</CardTitle>
                <CardDescription className="text-base">Bạn cần đăng nhập để có thể đăng tin tức</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert>
                <User className="h-4 w-4" />
                <AlertDescription>
                  Chỉ những người dùng đã đăng nhập mới có thể đăng tin tức. Vui lòng đăng nhập hoặc tạo tài khoản mới.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Link href="/login" className="block">
                  <Button className="w-full h-11">
                    <User className="h-4 w-4 mr-2" />
                    Đăng nhập ngay
                  </Button>
                </Link>

                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full h-11 bg-transparent">
                    Tạo tài khoản mới
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  ← Quay về trang chủ
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Check if user role is 'guest' (no permission to create posts)
  if (user.role === 'guest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Không có quyền truy cập</CardTitle>
                <CardDescription className="text-base">Tài khoản của bạn chỉ có thể xem tin tức</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Tài khoản khách chỉ có thể xem tin tức. Để tạo bài viết, bạn cần liên hệ quản trị viên để nâng cấp quyền.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Link href="/" className="block">
                  <Button className="w-full h-11">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Về trang chủ xem tin
                  </Button>
                </Link>

                <Button 
                  variant="outline" 
                  className="w-full h-11 bg-transparent"
                  onClick={() => {
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If user has permission (user or admin), show create post interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <PenTool className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Đăng tin tức</CardTitle>
              <CardDescription className="text-base">
                Chào mừng {user.fullname}! Bạn có quyền tạo và quản lý bài viết.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <PenTool className="h-4 w-4" />
              <AlertDescription>
                Bạn có thể tạo bài viết mới và quản lý các bài viết của mình.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Link href="/admin/create" className="block">
                <Button className="w-full h-11 justify-between">
                  <span className="flex items-center">
                    <PenTool className="h-4 w-4 mr-2" />
                    Tạo bài viết mới
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/admin/articles" className="block">
                <Button variant="outline" className="w-full h-11 justify-between bg-transparent">
                  <span>Quản lý bài viết của tôi</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Button 
                variant="ghost" 
                className="w-full h-11 justify-between bg-transparent"
                onClick={() => {
                  localStorage.removeItem('user')
                  window.location.href = '/'
                }}
              >
                <span>Đăng xuất</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                ← Quay về trang chủ
              </Link>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
