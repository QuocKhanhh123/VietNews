"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, User, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const categories = [
  { name: "Thời sự", href: "/category/thoi-su" },
  { name: "Kinh tế", href: "/category/kinh-te" },
  { name: "Thể thao", href: "/category/the-thao" },
  { name: "Giải trí", href: "/category/giai-tri" },
  { name: "Công nghệ", href: "/category/cong-nghe" },
  { name: "Sức khỏe", href: "/category/suc-khoe" },
  { name: "Giáo dục", href: "/category/giao-duc" },
  { name: "Du lịch", href: "/category/du-lich" },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
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

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex" viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-foreground/80">
                  Danh mục
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background border border-border shadow-lg min-w-[400px]">
                  <div className="grid gap-1 p-4 md:grid-cols-2 lg:min-w-[500px]">
                    {categories.map((category) => (
                      <NavigationMenuLink key={category.name} asChild>
                        <Link
                          href={category.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none text-foreground">
                            {category.name}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search and Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="hidden md:flex items-center space-x-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm tin tức..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </form>
            </div>

            {/* Mobile Search Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-4 w-4" />
            </Button>

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
                  <div className="space-y-2">
                    <h3 className="font-medium" style={{ color: "#1e293b" }}>
                      Danh mục
                    </h3>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block py-2 text-sm transition-colors"
                        style={{ color: "#475569" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#164e63"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#475569"
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="w-full justify-start" style={{ color: "#1e293b" }}>
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

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tin tức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
