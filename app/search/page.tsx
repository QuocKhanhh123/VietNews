"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchFilters } from "@/components/search-filters"
import { SearchResults } from "@/components/search-results"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Article {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  category: string
  categorySlug: string
  author: string
  publishedAt: string
  publishedDate: string
  slug: string
  views: number
  tags: string[]
  relevance: number
}

interface SearchResult {
  articles: Article[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  searchInfo: {
    query: string
    category: string
    sortBy: string
    totalResults: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Search parameters
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (data.success && data.data) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Search function
  const performSearch = useCallback(async (
    searchQuery: string,
    category: string = 'all',
    sort: string = 'relevance',
    page: number = 1
  ) => {
    // Allow search with only category filter (no query required)
    if (!searchQuery.trim() && category === 'all') {
      setError('Vui lòng nhập từ khóa tìm kiếm hoặc chọn danh mục')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        q: searchQuery || '',
        category: category === 'all' ? '' : category,
        sortBy: sort,
        page: page.toString(),
        limit: '12'
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setSearchResult(data.data)
      } else {
        setError(data.error || 'Có lỗi xảy ra khi tìm kiếm')
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Có lỗi xảy ra khi tìm kiếm')
    } finally {
      setLoading(false)
    }
  }, [])

  // Update URL and perform search
  const updateSearchParams = useCallback((
    newQuery?: string,
    newCategory?: string,
    newSort?: string,
    newPage?: number
  ) => {
    const params = new URLSearchParams()
    const searchQuery = newQuery !== undefined ? newQuery : query
    const category = newCategory !== undefined ? newCategory : selectedCategory
    const sort = newSort !== undefined ? newSort : sortBy
    const page = newPage !== undefined ? newPage : currentPage

    if (searchQuery) params.set('q', searchQuery)
    if (category && category !== 'all') params.set('category', category)
    if (sort && sort !== 'relevance') params.set('sortBy', sort)
    if (page > 1) params.set('page', page.toString())

    router.push(`/search?${params}`)
    
    // Allow search with query or category filter
    if (searchQuery || category !== 'all') {
      performSearch(searchQuery, category, sort, page)
    }
  }, [query, selectedCategory, sortBy, currentPage, router, performSearch])

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    updateSearchParams(query, selectedCategory, sortBy, 1)
  }

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory)
    setCurrentPage(1)
    updateSearchParams(query, newCategory, sortBy, 1)
  }

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    setCurrentPage(1)
    updateSearchParams(query, selectedCategory, newSort, 1)
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    updateSearchParams(query, selectedCategory, sortBy, newPage)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Initial search on page load
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    const urlCategory = searchParams.get('category') || 'all'
    const urlSort = searchParams.get('sortBy') || 'relevance'
    const urlPage = parseInt(searchParams.get('page') || '1')

    setQuery(urlQuery || '')
    setSelectedCategory(urlCategory)
    setSortBy(urlSort)
    setCurrentPage(urlPage)

    if (urlQuery || urlCategory !== 'all') {
      performSearch(urlQuery, urlCategory, urlSort, urlPage)
    }
  }, [searchParams, performSearch])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Tìm kiếm tin tức</h1>
          
          {/* Search Form */}
          <SearchFilters
            query={query}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            categories={categories}
            loading={loading}
            onQueryChange={setQuery}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onSearch={handleSearch}
          />
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Search Results */}
        {searchResult && !loading && (
          <SearchResults
            searchResult={searchResult}
            categories={categories}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            currentPage={currentPage}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
          />
        )}

        {/* Empty State - No search performed */}
        {!searchResult && !loading && !error && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="h-16 w-16 mx-auto text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nhập từ khóa để tìm kiếm</h3>
            <p className="text-muted-foreground">
              Tìm kiếm tin tức, bài viết theo từ khóa, danh mục...
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
