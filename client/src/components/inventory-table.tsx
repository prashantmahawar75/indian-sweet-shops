import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface InventoryItem {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  reorderPoint?: number
  active: boolean
  description?: string
}

interface InventoryTableProps {
  items: InventoryItem[]
  onEdit: (id: string) => void
  onAdjustStock: (id: string, delta: number, reason: string) => void
  onToggleActive: (id: string) => void
}

export function InventoryTable({ items, onEdit, onAdjustStock, onToggleActive }: InventoryTableProps) {
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustmentData, setAdjustmentData] = useState({
    type: "restock", // "restock" or "reduce"
    quantity: "",
    reason: "restock"
  })

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return "out"
    if (item.reorderPoint && item.quantity <= item.reorderPoint) return "low"
    return "good"
  }

  const getStatusBadge = (item: InventoryItem) => {
    const status = getStockStatus(item)
    const statusConfig = {
      out: { label: "Out of Stock", variant: "destructive" as const, icon: XCircle },
      low: { label: "Low Stock", variant: "secondary" as const, icon: AlertTriangle },
      good: { label: "In Stock", variant: "default" as const, icon: CheckCircle }
    }
    
    const { label, variant, icon: Icon } = statusConfig[status]
    
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedItem(item)
    setAdjustDialogOpen(true)
    setAdjustmentData({ type: "restock", quantity: "", reason: "restock" })
  }

  const handleSubmitAdjustment = () => {
    if (!selectedItem || !adjustmentData.quantity) return

    const quantity = parseInt(adjustmentData.quantity)
    const delta = adjustmentData.type === "restock" ? quantity : -quantity

    console.log(`Adjusting stock for ${selectedItem.name}: ${delta} (${adjustmentData.reason})`)
    onAdjustStock(selectedItem.id, delta, adjustmentData.reason)
    
    setAdjustDialogOpen(false)
    setSelectedItem(null)
    setAdjustmentData({ type: "restock", quantity: "", reason: "restock" })
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className={cn(!item.active && "opacity-60")}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium" data-testid={`text-item-name-${item.id}`}>
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.category}</Badge>
                </TableCell>
                <TableCell className="font-mono" data-testid={`text-item-price-${item.id}`}>
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium",
                      item.quantity === 0 ? "text-destructive" :
                      (item.reorderPoint && item.quantity <= item.reorderPoint) ? "text-yellow-600" : 
                      "text-foreground"
                    )} data-testid={`text-item-quantity-${item.id}`}>
                      {item.quantity}
                    </span>
                    {item.reorderPoint && item.quantity <= item.reorderPoint && (
                      <span className="text-xs text-muted-foreground">
                        (Reorder: {item.reorderPoint})
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(item)}
                </TableCell>
                <TableCell>
                  <Badge variant={item.active ? "default" : "secondary"}>
                    {item.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item.id)}
                      data-testid={`button-edit-item-${item.id}`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAdjustStock(item)}
                      data-testid={`button-adjust-stock-${item.id}`}
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Adjust
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {items.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No inventory items</h3>
            <p className="text-muted-foreground">Add your first sweet to get started</p>
          </div>
        )}
      </div>

      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Adjust inventory for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Adjustment Type</Label>
              <Select 
                value={adjustmentData.type} 
                onValueChange={(value) => setAdjustmentData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger data-testid="select-adjustment-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Add Stock (Restock)</SelectItem>
                  <SelectItem value="reduce">Reduce Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={adjustmentData.quantity}
                onChange={(e) => setAdjustmentData(prev => ({ ...prev, quantity: e.target.value }))}
                data-testid="input-adjustment-quantity"
              />
            </div>

            <div>
              <Label>Reason</Label>
              <Select 
                value={adjustmentData.reason} 
                onValueChange={(value) => setAdjustmentData(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger data-testid="select-adjustment-reason">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Restock</SelectItem>
                  <SelectItem value="sale">Manual Sale</SelectItem>
                  <SelectItem value="loss">Damaged/Lost</SelectItem>
                  <SelectItem value="correction">Inventory Correction</SelectItem>
                  <SelectItem value="return">Customer Return</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedItem && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Current Stock:</strong> {selectedItem.quantity} units
                </p>
                {adjustmentData.quantity && (
                  <p className="text-sm">
                    <strong>After Adjustment:</strong> {
                      adjustmentData.type === "restock" 
                        ? selectedItem.quantity + parseInt(adjustmentData.quantity)
                        : Math.max(0, selectedItem.quantity - parseInt(adjustmentData.quantity))
                    } units
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitAdjustment}
              disabled={!adjustmentData.quantity || parseInt(adjustmentData.quantity) <= 0}
              data-testid="button-confirm-adjustment"
            >
              Apply Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}