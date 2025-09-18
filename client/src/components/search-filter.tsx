import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

interface SearchFilterProps {
  onSearch: (query: string) => void
  onCategoryFilter: (category: string) => void
  onPriceFilter: (min: number, max: number) => void
  categories: string[]
  activeFilters: {
    category: string
    priceRange: string
  }
}

export function SearchFilter({ 
  onSearch, 
  onCategoryFilter, 
  onPriceFilter,
  categories,
  activeFilters 
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value: string) => {
    console.log(`Searching for: ${value}`)
    setSearchQuery(value)
    onSearch(value)
  }

  const handleCategoryChange = (category: string) => {
    console.log(`Filtering by category: ${category}`)
    onCategoryFilter(category)
  }

  const handlePriceRangeChange = (range: string) => {
    console.log(`Filtering by price range: ${range}`)
    const [min, max] = range.split("-").map(Number)
    onPriceFilter(min, max)
  }

  const clearFilters = () => {
    console.log("Clearing all filters")
    onCategoryFilter("")
    onPriceFilter(0, 1000)
    setSearchQuery("")
  }

  const hasActiveFilters = activeFilters.category || activeFilters.priceRange

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for sweets..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          data-testid="button-filter-toggle"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="p-4 border rounded-lg bg-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={activeFilters.category} onValueChange={handleCategoryChange}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <Select value={activeFilters.priceRange} onValueChange={handlePriceRangeChange}>
                <SelectTrigger data-testid="select-price-range">
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any price</SelectItem>
                  <SelectItem value="0-5">$0 - $5</SelectItem>
                  <SelectItem value="5-15">$5 - $15</SelectItem>
                  <SelectItem value="15-30">$15 - $30</SelectItem>
                  <SelectItem value="30-1000">$30+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.category && (
                <Badge variant="secondary">Category: {activeFilters.category}</Badge>
              )}
              {activeFilters.priceRange && (
                <Badge variant="secondary">Price: ${activeFilters.priceRange}</Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}