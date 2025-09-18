import { useState } from "react"
import { InventoryTable } from "@/components/inventory-table"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "wouter"
import { useToast } from "@/hooks/use-toast"

// Mock inventory data - todo: remove mock functionality
const mockInventoryItems = [
  { id: "1", name: "Dark Chocolate Truffle", category: "Chocolate", price: 15.99, quantity: 25, reorderPoint: 10, active: true, description: "Rich dark chocolate with smooth ganache center" },
  { id: "2", name: "Rainbow Gummy Bears", category: "Gummy", price: 8.50, quantity: 0, reorderPoint: 15, active: true, description: "Colorful fruit-flavored gummy bears" },
  { id: "3", name: "Caramel Sea Salt", category: "Caramel", price: 12.75, quantity: 15, reorderPoint: 8, active: true, description: "Sweet caramel with a hint of sea salt" },
  { id: "4", name: "Strawberry Lollipop", category: "Lollipop", price: 4.99, quantity: 3, reorderPoint: 20, active: true, description: "Classic strawberry flavored lollipops" },
  { id: "5", name: "Mint Chocolate Chip", category: "Chocolate", price: 18.50, quantity: 8, reorderPoint: 12, active: true, description: "Cool mint chocolate with chocolate chips" },
  { id: "6", name: "Sour Patch Kids", category: "Gummy", price: 6.99, quantity: 20, reorderPoint: 25, active: true, description: "Sour then sweet gummy candies" },
  { id: "7", name: "Premium Bonbons", category: "Premium", price: 24.99, quantity: 12, reorderPoint: 5, active: true, description: "Luxury assorted chocolate bonbons" },
  { id: "8", name: "Honey Drops", category: "Hard Candy", price: 5.75, quantity: 30, reorderPoint: 15, active: true, description: "Natural honey hard candy drops" },
]

const categories = Array.from(new Set(mockInventoryItems.map(item => item.category)))

export default function AdminDashboard() {
  const [filteredItems, setFilteredItems] = useState(mockInventoryItems)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceRange: ""
  })
  const { toast } = useToast()

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
    let filtered = mockInventoryItems

    if (currentFilters.search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        item.category.toLowerCase().includes(currentFilters.search.toLowerCase())
      )
    }

    if (currentFilters.category) {
      filtered = filtered.filter(item => item.category === currentFilters.category)
    }

    if (currentFilters.priceRange) {
      const [min, max] = currentFilters.priceRange.split("-").map(Number)
      filtered = filtered.filter(item => item.price >= min && item.price <= max)
    }

    setFilteredItems(filtered)
  }

  const handleEdit = (itemId: string) => {
    console.log("Edit inventory item:", itemId)
    toast({
      title: "Edit Item",
      description: "Edit functionality will be implemented in the full application.",
    })
  }

  const handleAdjustStock = (itemId: string, delta: number, reason: string) => {
    console.log(`Adjusting stock for item ${itemId}: ${delta} (${reason})`)
    
    // Update the mock data
    const updatedItems = mockInventoryItems.map(item =>
      item.id === itemId 
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    )
    
    // Update filtered items
    setFilteredItems(updatedItems.filter(item => {
      let matches = true
      if (filters.search) {
        matches = matches && (item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                             item.category.toLowerCase().includes(filters.search.toLowerCase()))
      }
      if (filters.category) {
        matches = matches && item.category === filters.category
      }
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number)
        matches = matches && item.price >= min && item.price <= max
      }
      return matches
    }))

    const item = mockInventoryItems.find(i => i.id === itemId)
    toast({
      title: "Stock Updated",
      description: `${item?.name} stock ${delta > 0 ? 'increased' : 'decreased'} by ${Math.abs(delta)} units.`,
    })
  }

  const handleToggleActive = (itemId: string) => {
    console.log("Toggle active status for item:", itemId)
    toast({
      title: "Status Updated",
      description: "Item status has been updated.",
    })
  }

  const lowStockItems = filteredItems.filter(item => item.reorderPoint && item.quantity <= item.reorderPoint)
  const outOfStockItems = filteredItems.filter(item => item.quantity === 0)

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
                {mockInventoryItems.length}
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
          Showing {filteredItems.length} of {mockInventoryItems.length} items
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable
        items={filteredItems}
        onEdit={handleEdit}
        onAdjustStock={handleAdjustStock}
        onToggleActive={handleToggleActive}
      />
    </div>
  )
}