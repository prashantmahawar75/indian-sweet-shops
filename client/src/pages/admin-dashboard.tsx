import { useState } from "react"
import { SweetCard } from "@/components/sweet-card"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "wouter"

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

export default function AdminDashboard() {
  const [filteredSweets, setFilteredSweets] = useState(mockSweets)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceRange: ""
  })

  const handleSearch = (query: string) => {
    console.log("Admin search query:", query)
    setFilters(prev => ({ ...prev, search: query }))
    applyFilters({ ...filters, search: query })
  }

  const handleCategoryFilter = (category: string) => {
    console.log("Admin category filter:", category)
    setFilters(prev => ({ ...prev, category }))
    applyFilters({ ...filters, category })
  }

  const handlePriceFilter = (min: number, max: number) => {
    console.log("Admin price filter:", min, max)
    const priceRange = min === 0 && max === 1000 ? "" : `${min}-${max}`
    setFilters(prev => ({ ...prev, priceRange }))
    applyFilters({ ...filters, priceRange })
  }

  const applyFilters = (currentFilters: typeof filters) => {
    let filtered = mockSweets

    if (currentFilters.search) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        sweet.category.toLowerCase().includes(currentFilters.search.toLowerCase())
      )
    }

    if (currentFilters.category) {
      filtered = filtered.filter(sweet => sweet.category === currentFilters.category)
    }

    if (currentFilters.priceRange) {
      const [min, max] = currentFilters.priceRange.split("-").map(Number)
      filtered = filtered.filter(sweet => sweet.price >= min && sweet.price <= max)
    }

    setFilteredSweets(filtered)
  }

  const handleEdit = (sweetId: string) => {
    console.log("Edit sweet:", sweetId)
    // Navigate to edit form
  }

  const handleDelete = (sweetId: string) => {
    console.log("Delete sweet:", sweetId)
    // Show confirmation and delete
    const updatedSweets = mockSweets.filter(sweet => sweet.id !== sweetId)
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

  const lowStockItems = filteredSweets.filter(sweet => sweet.quantity <= 5)
  const outOfStockItems = filteredSweets.filter(sweet => sweet.quantity === 0)

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-admin-title">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Manage your sweet shop inventory, pricing, and stock levels
          </p>
        </div>
        <Link href="/add-sweet">
          <Button className="gap-2" data-testid="button-add-sweet">
            <Plus className="h-4 w-4" />
            Add Sweet
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-card-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <p className="text-2xl font-bold" data-testid="text-total-items">
                {mockSweets.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600" data-testid="text-low-stock-items">
                {lowStockItems.length}
              </p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-2xl">🚫</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive" data-testid="text-out-of-stock-items">
                {outOfStockItems.length}
              </p>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
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
        <h2 className="text-2xl font-semibold">
          Inventory Items
        </h2>
        <div className="text-muted-foreground">
          Showing {filteredSweets.length} of {mockSweets.length} items
        </div>
      </div>

      {/* Sweet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSweets.map((sweet) => (
          <SweetCard
            key={sweet.id}
            sweet={sweet}
            isAdmin={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredSweets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}