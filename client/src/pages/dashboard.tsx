import { useState } from "react"
import { SweetCard } from "@/components/sweet-card"
import { SearchFilter } from "@/components/search-filter"
import heroImage from "@assets/generated_images/Sweet_shop_product_display_5ffd20d5.png"

// Mock sweets data - todo: remove mock functionality
const mockSweets = [
  { id: "1", name: "Dark Chocolate Truffle", category: "Chocolate", price: 15.99, quantity: 25 },
  { id: "2", name: "Rainbow Gummy Bears", category: "Gummy", price: 8.50, quantity: 0 },
  { id: "3", name: "Caramel Sea Salt", category: "Caramel", price: 12.75, quantity: 15 },
  { id: "4", name: "Strawberry Lollipop", category: "Lollipop", price: 4.99, quantity: 3 },
  { id: "5", name: "Mint Chocolate Chip", category: "Chocolate", price: 18.50, quantity: 8 },
  { id: "6", name: "Sour Patch Kids", category: "Gummy", price: 6.99, quantity: 20 },
  { id: "7", name: "Premium Bonbons", category: "Premium", price: 24.99, quantity: 12 },
  { id: "8", name: "Honey Drops", category: "Hard Candy", price: 5.75, quantity: 30 },
]

const categories = Array.from(new Set(mockSweets.map(sweet => sweet.category)))

export default function Dashboard() {
  const [filteredSweets, setFilteredSweets] = useState(mockSweets)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceRange: ""
  })

  const handleSearch = (query: string) => {
    console.log("Search query:", query)
    setFilters(prev => ({ ...prev, search: query }))
    applyFilters({ ...filters, search: query })
  }

  const handleCategoryFilter = (category: string) => {
    console.log("Category filter:", category)
    setFilters(prev => ({ ...prev, category }))
    applyFilters({ ...filters, category })
  }

  const handlePriceFilter = (min: number, max: number) => {
    console.log("Price filter:", min, max)
    const priceRange = min === 0 && max === 1000 ? "" : `${min}-${max}`
    setFilters(prev => ({ ...prev, priceRange }))
    applyFilters({ ...filters, priceRange })
  }

  const applyFilters = (currentFilters: typeof filters) => {
    let filtered = mockSweets

    // Search filter
    if (currentFilters.search) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        sweet.category.toLowerCase().includes(currentFilters.search.toLowerCase())
      )
    }

    // Category filter
    if (currentFilters.category) {
      filtered = filtered.filter(sweet => sweet.category === currentFilters.category)
    }

    // Price filter
    if (currentFilters.priceRange) {
      const [min, max] = currentFilters.priceRange.split("-").map(Number)
      filtered = filtered.filter(sweet => sweet.price >= min && sweet.price <= max)
    }

    setFilteredSweets(filtered)
  }

  const handlePurchase = (sweetId: string) => {
    console.log("Purchase sweet:", sweetId)
    // Update quantity in mock data
    const updatedSweets = mockSweets.map(sweet =>
      sweet.id === sweetId && sweet.quantity > 0
        ? { ...sweet, quantity: sweet.quantity - 1 }
        : sweet
    )
    // Update both original and filtered data
    setFilteredSweets(updatedSweets.filter(sweet => {
      let matches = true
      if (filters.search) {
        matches = matches && (sweet.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                             sweet.category.toLowerCase().includes(filters.search.toLowerCase()))
      }
      if (filters.category) {
        matches = matches && sweet.category === filters.category
      }
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number)
        matches = matches && sweet.price >= min && sweet.price <= max
      }
      return matches
    }))
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImage})`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-center text-white">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-hero-title">
                Sweet Shop Paradise
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Discover our premium collection of artisanal sweets and candies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onPriceFilter={handlePriceFilter}
        categories={categories}
        activeFilters={{
          category: filters.category,
          priceRange: filters.priceRange
        }}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold" data-testid="text-results-title">
          Our Sweet Collection
        </h2>
        <div className="text-muted-foreground">
          Showing {filteredSweets.length} of {mockSweets.length} sweets
        </div>
      </div>

      {/* Sweet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSweets.map((sweet) => (
          <SweetCard
            key={sweet.id}
            sweet={sweet}
            onPurchase={handlePurchase}
          />
        ))}
      </div>

      {filteredSweets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍭</div>
          <h3 className="text-xl font-semibold mb-2">No sweets found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}