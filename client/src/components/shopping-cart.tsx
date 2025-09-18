import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ShoppingCart as CartIcon, Plus, Minus, Trash2, CreditCard } from "lucide-react"

interface CartItem {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  maxQuantity: number
}

interface ShoppingCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: (customerInfo: { name: string; email: string }) => void
}

export function ShoppingCart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" })

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    const item = items.find(i => i.id === id)
    if (!item) return

    const quantity = Math.max(0, Math.min(newQuantity, item.maxQuantity))
    console.log(`Updating cart quantity for ${item.name}: ${quantity}`)
    onUpdateQuantity(id, quantity)
  }

  const handleRemoveItem = (id: string) => {
    console.log(`Removing item from cart: ${id}`)
    onRemoveItem(id)
  }

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.email) return
    
    console.log("Processing checkout:", { customerInfo, items, total: totalPrice })
    onCheckout(customerInfo)
    setCheckoutOpen(false)
    setIsOpen(false)
    setCustomerInfo({ name: "", email: "" })
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative gap-2" data-testid="button-open-cart">
            <CartIcon className="h-4 w-4" />
            Cart
            {totalItems > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <CartIcon className="h-5 w-5" />
              Shopping Cart
            </SheetTitle>
            <SheetDescription>
              {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 py-4 flex-1 overflow-auto">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <CartIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add some sweets to get started!</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate" data-testid={`text-cart-item-${item.id}`}>
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      <span className="text-sm font-medium text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      data-testid={`button-decrease-${item.id}`}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="w-8 text-center font-medium" data-testid={`text-cart-quantity-${item.id}`}>
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                      data-testid={`button-increase-${item.id}`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 ml-2"
                      onClick={() => handleRemoveItem(item.id)}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right min-w-0">
                    <p className="font-medium" data-testid={`text-cart-subtotal-${item.id}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity >= item.maxQuantity && (
                      <p className="text-xs text-yellow-600">Max stock</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span data-testid="text-cart-total">${totalPrice.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full gap-2" 
                  onClick={() => setCheckoutOpen(true)}
                  data-testid="button-proceed-checkout"
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Checkout
                </Button>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Complete your order for ${totalPrice.toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="customer-name">Full Name *</Label>
              <Input
                id="customer-name"
                placeholder="Enter your full name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                data-testid="input-checkout-name"
              />
            </div>

            <div>
              <Label htmlFor="customer-email">Email Address *</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="Enter your email address"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                data-testid="input-checkout-email"
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCheckout}
              disabled={!customerInfo.name || !customerInfo.email}
              data-testid="button-complete-order"
            >
              Complete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}