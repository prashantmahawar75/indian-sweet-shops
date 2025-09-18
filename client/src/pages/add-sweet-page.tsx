import { AddSweetForm } from "@/components/add-sweet-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "wouter"

export default function AddSweetPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (sweetData: {
    name: string
    category: string
    price: number
    quantity: number
    description?: string
  }) => {
    console.log("Adding new sweet:", sweetData)
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log("Sweet added successfully!")
      // TODO: Navigate back to admin dashboard or show success message
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory">
          <Button variant="outline" size="sm" data-testid="button-back-to-inventory">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Sweet</h1>
          <p className="text-muted-foreground">
            Add a new sweet to your inventory with pricing and stock information
          </p>
        </div>
      </div>

      <AddSweetForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}