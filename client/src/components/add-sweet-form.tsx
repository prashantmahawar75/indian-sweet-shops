import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface AddSweetFormProps {
  onSubmit: (sweetData: {
    name: string
    category: string
    price: number
    quantity: number
    description?: string
  }) => void
  isLoading?: boolean
  initialData?: {
    name: string
    category: string
    price: number
    quantity: number
    description?: string
  }
  mode?: "add" | "edit"
}

const CATEGORIES = ["Chocolate", "Candy", "Gummy", "Hard Candy", "Caramel", "Lollipop", "Premium"]

export function AddSweetForm({ onSubmit, isLoading = false, initialData, mode = "add" }: AddSweetFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    price: initialData?.price || 0,
    quantity: initialData?.quantity || 0,
    description: initialData?.description || ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`${mode} sweet form submitted`, formData)
    onSubmit({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    })
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isValid = formData.name && formData.category && formData.price > 0 && formData.quantity >= 0

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {mode === "add" ? "Add New Sweet" : "Edit Sweet"}
        </CardTitle>
        <CardDescription>
          {mode === "add" 
            ? "Add a new sweet to your inventory with details and pricing"
            : "Update the sweet details and inventory information"
          }
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sweet Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Dark Chocolate Truffle"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                data-testid="input-sweet-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger data-testid="select-sweet-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
                data-testid="input-sweet-price"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.quantity || ""}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                required
                data-testid="input-sweet-quantity"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the sweet's ingredients, flavor, or special features..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              data-testid="input-sweet-description"
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-4">
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            data-testid="button-submit-sweet"
          >
            {isLoading ? "Saving..." : mode === "add" ? "Add Sweet" : "Update Sweet"}
          </Button>
          <Button type="button" variant="outline" data-testid="button-cancel">
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}