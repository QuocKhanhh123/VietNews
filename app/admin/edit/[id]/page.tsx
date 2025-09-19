"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

interface Category {
  _id: string
  name: string
  slug: string
}

interface Article {
  _id: string
  title: string
  slug: string
  shortDescription: string
  content: string
  coverImageUrl: string
  categoryId: string
  categoryName: string
  tags: string[]
  status: 'published' | 'draft'
  authorId: string
}

export default function EditArticle() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingArticle, setIsLoadingArticle] = useState(true)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    categoryId: "",
    tags: "",
    status: "draft" as "draft" | "published",
    featuredImage: "",
  })

  const [tagList, setTagList] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Fetch article data and categories
  useEffect(() => {
    if (articleId) {
      fetchArticleData()
      fetchCategories()
    }
  }, [articleId])

  const fetchArticleData = async () => {
    setIsLoadingArticle(true)
    try {
      const response = await fetch(`/api/articles/${articleId}?admin=true`)
      const data = await response.json()

      if (data.success) {
        const article: Article = data.data
        
        // Check if current user owns this article
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          if (user.id !== article.authorId) {
            setError('Bạn không có quyền chỉnh sửa bài viết này')
            return
          }
        }

        setFormData({
          title: article.title,
          description: article.shortDescription,
          content: article.content,
          category: article.categoryName,
          categoryId: article.categoryId,
          status: article.status,
          featuredImage: article.coverImageUrl || "",
          tags: ""
        })
        setTagList(article.tags || [])
      } else {
        setError(data.error || 'Không thể tải thông tin bài viết')
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setIsLoadingArticle(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCategoryChange = (categoryName: string) => {
    const selectedCategory = categories.find(cat => cat.name === categoryName)
    if (selectedCategory) {
      setFormData(prev => ({
        ...prev,
        category: categoryName,
        categoryId: selectedCategory._id
      }))
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Kích thước file không được vượt quá 5MB')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload to our API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, featuredImage: data.imageUrl }))
      } else {
        setError(data.error || 'Có lỗi xảy ra khi tải ảnh lên')
      }
      
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Có lỗi xảy ra khi tải ảnh lên')
    } finally {
      setUploadingImage(false)
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !tagList.includes(currentTag.trim())) {
      setTagList((prev) => [...prev, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTagList((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (status: "draft" | "published") => {
    // Validation
    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết")
      return
    }
    if (!formData.description.trim()) {
      setError("Vui lòng nhập mô tả ngắn")
      return
    }
    if (!formData.content.trim()) {
      setError("Vui lòng nhập nội dung bài viết")
      return
    }
    if (!formData.categoryId) {
      setError("Vui lòng chọn danh mục")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Get current user for authorization
      const userData = localStorage.getItem('user')
      if (!userData) {
        setError('Không tìm thấy thông tin người dùng')
        return
      }

      const user = JSON.parse(userData)
      if (!user.id) {
        setError('Không tìm thấy ID người dùng')
        return
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          shortDescription: formData.description.trim(),
          content: formData.content.trim(),
          categoryId: formData.categoryId,
          tags: tagList,
          status,
          coverImageUrl: formData.featuredImage || '/placeholder.jpg',
          authorId: user.id
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Success - redirect to admin articles page
        router.push('/admin/articles')
      } else {
        setError(data.error || 'Có lỗi xảy ra khi cập nhật bài viết')
      }
    } catch (error) {
      console.error('Error updating article:', error)
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingArticle) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Đang tải thông tin bài viết...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chỉnh sửa bài viết</h1>
          <p className="text-muted-foreground mt-1">Cập nhật nội dung bài viết</p>
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-lg mt-2">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài viết</CardTitle>
              <CardDescription>Chỉnh sửa tiêu đề, mô tả và nội dung chính của bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài viết *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả ngắn *</Label>
                <Textarea
                  id="description"
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết (150-200 từ)..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung bài viết *</Label>
                <Textarea
                  id="content"
                  placeholder="Viết nội dung chi tiết của bài viết..."
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  rows={12}
                  className="min-h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
              <CardDescription>Chọn ảnh đại diện cho bài viết (khuyến nghị 1200x630px)</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.featuredImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={formData.featuredImage} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => document.getElementById('image-upload')?.click()}>
                    Thay đổi ảnh
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {uploadingImage ? 'Đang tải ảnh...' : 'Kéo thả ảnh vào đây hoặc click để chọn file'}
                  </p>
                  <Button variant="outline" disabled={uploadingImage}>
                    {uploadingImage ? 'Đang tải...' : 'Chọn ảnh'}
                  </Button>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Cập nhật</CardTitle>
              <CardDescription>Lưu thay đổi hoặc cập nhật trạng thái</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSubmit("draft")} 
                  variant="outline" 
                  className="flex-1"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Đang lưu..." : "Lưu nháp"}
                </Button>
                <Button 
                  onClick={() => handleSubmit("published")} 
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </div>
              <Link href={`/news/${articleId}`}>
                <Button variant="ghost" className="w-full" disabled={isLoading}>
                  <Eye className="h-4 w-4 mr-2" />
                  Xem bài viết
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái hiện tại</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
                {formData.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              </Badge>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Danh mục</CardTitle>
              <CardDescription>Chọn danh mục phù hợp cho bài viết</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Thẻ tag</CardTitle>
              <CardDescription>Thêm các từ khóa liên quan để dễ tìm kiếm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập tag..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button onClick={addTag} variant="outline" size="sm">
                  Thêm
                </Button>
              </div>
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tagList.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}