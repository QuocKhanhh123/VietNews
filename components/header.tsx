"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, User, PenTool, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface Category {
  id: string
  name: string
  slug: string
}

export function Header() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const response = await fetch('/api/categories')
      const data = await response.json()

      if (data.success && data.data) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleCategoryFilter = (categorySlug: string) => {
    if (categorySlug === 'all') {
      router.push('/')
    } else {
      // Chuyển đến trang category
      router.push(`/category/${categorySlug}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-primary">VietNews</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex flex-1 justify-evenly items-center">
            {/* Danh mục */}
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-foreground/80">
                    Danh mục
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background border border-border shadow-lg min-w-[400px]">
                    <div className="grid gap-1 p-4 md:grid-cols-2 lg:min-w-[500px]">
                      {/* Quick Actions */}
                      <div className="col-span-2 border-b pb-4 mb-4">
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => handleCategoryFilter('all')}
                            className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-primary/5"
                          >
                            <div className="text-sm font-medium leading-none text-foreground flex items-center">
                              📰 Tất cả tin tức
                            </div>
                            <div className="text-xs text-muted-foreground">Xem tất cả bài viết</div>
                          </button>
                        </NavigationMenuLink>
                      </div>

                      {/* Categories */}
                      {categoriesLoading ? (
                        <div className="col-span-2 flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          <span className="ml-2 text-sm text-muted-foreground">
                            Đang tải danh mục...
                          </span>
                        </div>
                      ) : (
                        categories.map((category) => (
                          <NavigationMenuLink key={category.id} asChild>
                            <button
                              onClick={() => handleCategoryFilter(category.slug)}
                              className="w-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none text-foreground">
                                {category.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Xem tin tức {category.name.toLowerCase()}
                              </div>
                            </button>
                          </NavigationMenuLink>
                        ))
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Tìm kiếm */}
            <Link href="/search">
              <Button variant="ghost" size="sm" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm tin tức
              </Button>
            </Link>

            {/* Giới thiệu */}
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Giới thiệu
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Auth Buttons */}
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <User className="h-4 w-4 mr-2" />
                Đăng nhập
              </Button>
            </Link>
            <Link href="/post">
              <Button size="sm" className="hidden sm:flex">
                <PenTool className="h-4 w-4 mr-2" />
                Đăng tin
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white">
                <SheetHeader>
                  <SheetTitle style={{ color: "#1e293b" }}>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Mobile Search Link */}
                  <div className="space-y-2">
                    <Link href="/search" className="block">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        style={{ color: "#1e293b" }}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Tìm kiếm tin tức
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="font-medium" style={{ color: "#1e293b" }}>
                      Danh mục
                    </h3>
                    <button
                      onClick={() => handleCategoryFilter('all')}
                      className="block w-full text-left py-2 text-sm transition-colors rounded px-2"
                      style={{ color: "#475569" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f1f5f9"
                        e.currentTarget.style.color = "#164e63"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent"
                        e.currentTarget.style.color = "#475569"
                      }}
                    >
                      📰 Tất cả tin tức
                    </button>
                    {categoriesLoading ? (
                      <div className="flex items-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Đang tải...</span>
                      </div>
                    ) : (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryFilter(category.slug)}
                          className="block w-full text-left py-2 text-sm transition-colors rounded px-2"
                          style={{ color: "#475569" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f1f5f9"
                            e.currentTarget.style.color = "#164e63"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent"
                            e.currentTarget.style.color = "#475569"
                          }}
                        >
                          {category.name}
                        </button>
                      ))
                    )}
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <Link href="/login" className="block">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        style={{ color: "#1e293b" }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/post" className="block">
                      <Button className="w-full justify-start">
                        <PenTool className="h-4 w-4 mr-2" />
                        Đăng tin
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>

  )
}
