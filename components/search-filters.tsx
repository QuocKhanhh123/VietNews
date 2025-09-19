import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, SortAsc } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface SearchFiltersProps {
  query: string
  selectedCategory: string
  sortBy: string
  categories: Category[]
  loading: boolean
  onQueryChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: string) => void
  onSearch: (e: React.FormEvent) => void
}

export function SearchFilters({
  query,
  selectedCategory,
  sortBy,
  categories,
  loading,
  onQueryChange,
  onCategoryChange,
  onSortChange,
  onSearch
}: SearchFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={onSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nhập từ khóa tìm kiếm..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <div className="lg:w-48">
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort Options */}
            <div className="lg:w-48">
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger>
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Liên quan nhất</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="most-viewed">Xem nhiều nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Search Button */}
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}