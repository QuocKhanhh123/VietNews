import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

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

interface SearchResultsProps {
  searchResult: SearchResult
  categories: Category[]
  selectedCategory: string
  sortBy: string
  currentPage: number
  onCategoryChange: (category: string) => void
  onSortChange: (sort: string) => void
  onPageChange: (page: number) => void
}

export function SearchResults({
  searchResult,
  categories,
  selectedCategory,
  sortBy,
  currentPage,
  onCategoryChange,
  onSortChange,
  onPageChange
}: SearchResultsProps) {
  return (
    <>
      {/* Search Results Info */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="text-sm text-muted-foreground">
          Tìm thấy <span className="font-semibold text-foreground">{searchResult.searchInfo.totalResults}</span> kết quả
          {searchResult.searchInfo.query && (
            <span> cho "<span className="font-semibold text-foreground">{searchResult.searchInfo.query}</span>"</span>
          )}
        </div>
        
        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onCategoryChange('all')}>
              {categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}
              <span className="ml-1">×</span>
            </Badge>
          )}
          {sortBy !== 'relevance' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onSortChange('relevance')}>
              {sortBy === 'newest' ? 'Mới nhất' : 
               sortBy === 'oldest' ? 'Cũ nhất' : 
               sortBy === 'most-viewed' ? 'Xem nhiều nhất' : sortBy}
              <span className="ml-1">×</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {searchResult.articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {searchResult.articles.map((article) => (
            <NewsCard
              key={article.id}
              id={article.id}
              title={article.title}
              excerpt={article.excerpt}
              imageUrl={article.imageUrl}
              category={article.category}
              author={article.author}
              publishedAt={article.publishedAt}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
          <p className="text-muted-foreground mb-4">
            Không có bài viết nào phù hợp với từ khóa "{searchResult.searchInfo.query}"
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Gợi ý:</p>
            <ul className="mt-2 space-y-1">
              <li>• Thử sử dụng từ khóa khác</li>
              <li>• Kiểm tra chính tả</li>
              <li>• Sử dụng từ khóa ngắn gọn hơn</li>
              <li>• Thử tìm kiếm với "Tất cả danh mục"</li>
            </ul>
          </div>
        </div>
      )}

      {/* Pagination */}
      {searchResult.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!searchResult.pagination.hasPrevPage}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Trước
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, searchResult.pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1
              const isActive = pageNum === currentPage
              
              return (
                <Button
                  key={pageNum}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
            
            {searchResult.pagination.totalPages > 5 && (
              <>
                {currentPage < searchResult.pagination.totalPages - 2 && <span className="px-2">...</span>}
                <Button
                  variant={currentPage === searchResult.pagination.totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(searchResult.pagination.totalPages)}
                >
                  {searchResult.pagination.totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!searchResult.pagination.hasNextPage}
          >
            Sau
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </>
  )
}