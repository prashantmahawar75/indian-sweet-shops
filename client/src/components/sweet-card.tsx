import { ShoppingCart, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SweetCardProps {
  sweet: {
    id: string
    name: string
    category: string
    price: number
    quantity: number
    image?: string
  }
  isAdmin?: boolean
  onPurchase?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function SweetCard({ sweet, isAdmin = false, onPurchase, onEdit, onDelete }: SweetCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false)
  
  const isOutOfStock = sweet.quantity === 0
  const isLowStock = sweet.quantity <= 5 && sweet.quantity > 0

  const handlePurchase = async () => {
    console.log(`Purchasing sweet: ${sweet.name}`)
    setIsPurchasing(true)
    // Simulate API call
    setTimeout(() => {
      setIsPurchasing(false)
      onPurchase?.(sweet.id)
    }, 1000)
  }

  const handleEdit = () => {
    console.log(`Editing sweet: ${sweet.name}`)
    onEdit?.(sweet.id)
  }

  const handleDelete = () => {
    console.log(`Deleting sweet: ${sweet.name}`)
    onDelete?.(sweet.id)
  }

  return (
    <Card className={cn("hover-elevate overflow-hidden transition-all", isOutOfStock && "opacity-75")}>
      <CardHeader className="p-0">
        <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
          {sweet.image ? (
            <img src={sweet.image} alt={sweet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl">🍭</div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight" data-testid={`text-sweet-name-${sweet.id}`}>
            {sweet.name}
          </h3>
          <Badge variant="outline" className="text-xs">
            {sweet.category}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary" data-testid={`text-sweet-price-${sweet.id}`}>
            ₹{sweet.price}
          </span>
          <div className="text-right">
            <div className={cn("text-sm font-medium", 
              isOutOfStock && "text-destructive",
              isLowStock && "text-yellow-600"
            )} data-testid={`text-sweet-stock-${sweet.id}`}>
              {isOutOfStock ? "Out of Stock" : `${sweet.quantity} in stock`}
            </div>
            {isLowStock && <div className="text-xs text-yellow-600">Low Stock</div>}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        {isAdmin ? (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEdit}
              className="flex-1"
              data-testid={`button-edit-${sweet.id}`}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              data-testid={`button-delete-${sweet.id}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <Button 
            className="w-full" 
            disabled={isOutOfStock || isPurchasing}
            onClick={handlePurchase}
            data-testid={`button-purchase-${sweet.id}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isPurchasing ? "Purchasing..." : isOutOfStock ? "Out of Stock" : "Purchase"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}