import { useState } from "react"
import { SweetCard } from "@/components/sweet-card"
import { SearchFilter } from "@/components/search-filter"
import { ShoppingCart } from "@/components/shopping-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
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

interface CartItem {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  maxQuantity: number
}

export default function Dashboard() {
  const [filteredSweets, setFilteredSweets] = useState(mockSweets)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceRange: ""
  })
  const { toast } = useToast()

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

  const handleAddToCart = (sweetId: string) => {
    const sweet = mockSweets.find(s => s.id === sweetId)
    if (!sweet || sweet.quantity === 0) return

    console.log("Add to cart:", sweetId)
    
    const existingCartItem = cartItems.find(item => item.id === sweetId)
    
    if (existingCartItem) {
      if (existingCartItem.quantity >= sweet.quantity) {
        toast({
          title: "Cannot add more",
          description: "You've reached the maximum available quantity for this item.",
          variant: "destructive"
        })
        return
      }
      
      setCartItems(prev => prev.map(item =>
        item.id === sweetId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      const newCartItem: CartItem = {
        id: sweet.id,
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: 1,
        maxQuantity: sweet.quantity
      }
      setCartItems(prev => [...prev, newCartItem])
    }

    toast({
      title: "Added to cart",
      description: `${sweet.name} has been added to your cart.`,
    })
  }

  const handleCartQuantityUpdate = (sweetId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== sweetId))
    } else {
      setCartItems(prev => prev.map(item =>
        item.id === sweetId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const handleRemoveFromCart = (sweetId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== sweetId))
    
    const sweet = mockSweets.find(s => s.id === sweetId)
    if (sweet) {
      toast({
        title: "Removed from cart",
        description: `${sweet.name} has been removed from your cart.`,
      })
    }
  }

  const handleCheckout = (customerInfo: { name: string; email: string }) => {
    console.log("Processing checkout:", { customerInfo, items: cartItems })
    
    // Simulate order processing
    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: `Thank you ${customerInfo.name}! Your order has been received and will be processed shortly.`,
      })
      setCartItems([]) // Clear cart after successful checkout
    }, 1000)
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

      {/* Featured Categories */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge 
          variant="outline" 
          className="cursor-pointer hover-elevate text-sm px-4 py-2"
          onClick={() => handleCategoryFilter("Chocolate")}
        >
          🍫 Chocolate
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover-elevate text-sm px-4 py-2"
          onClick={() => handleCategoryFilter("Gummy")}
        >
          🐻 Gummy Bears
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover-elevate text-sm px-4 py-2"
          onClick={() => handleCategoryFilter("Caramel")}
        >
          🍮 Caramel
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover-elevate text-sm px-4 py-2"
          onClick={() => handleCategoryFilter("Premium")}
        >
          💎 Premium
        </Badge>
      </div>

      {/* Search and Filter with Cart */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
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
        </div>
        <ShoppingCart
          items={cartItems}
          onUpdateQuantity={handleCartQuantityUpdate}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      </div>

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
            onPurchase={handleAddToCart}
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