import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { DollarSign, ShoppingBag, TrendingUp, Clock, Eye, CheckCircle, XCircle, RefreshCw } from "lucide-react"

// Mock sales data - todo: remove mock functionality
const mockSalesKPIs = {
  todayRevenue: 1250.75,
  todayOrders: 28,
  averageOrderValue: 44.67,
  pendingOrders: 5,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
}

const mockOrders = [
  {
    id: "ORD-001",
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    status: "pending",
    total: 45.50,
    items: [
      { name: "Dark Chocolate Truffle", quantity: 2, unitPrice: 15.99 },
      { name: "Caramel Squares", quantity: 3, unitPrice: 4.51 }
    ],
    createdAt: "2024-03-15 10:30:00"
  },
  {
    id: "ORD-002",
    customerName: "Bob Wilson",
    customerEmail: "bob@example.com",
    status: "paid",
    total: 28.75,
    items: [
      { name: "Rainbow Gummy Bears", quantity: 3, unitPrice: 8.50 },
      { name: "Mint Drops", quantity: 1, unitPrice: 3.75 }
    ],
    createdAt: "2024-03-15 09:45:00"
  },
  {
    id: "ORD-003",
    customerName: "Carol Davis",
    customerEmail: "carol@example.com",
    status: "fulfilled",
    total: 67.25,
    items: [
      { name: "Premium Bonbons", quantity: 2, unitPrice: 24.99 },
      { name: "Strawberry Lollipops", quantity: 4, unitPrice: 4.32 }
    ],
    createdAt: "2024-03-14 16:20:00"
  },
  {
    id: "ORD-004",
    customerName: "David Martinez",
    customerEmail: "david@example.com",
    status: "paid",
    total: 89.99,
    items: [
      { name: "Luxury Chocolate Box", quantity: 1, unitPrice: 89.99 }
    ],
    createdAt: "2024-03-14 14:15:00"
  }
]

type OrderStatus = "pending" | "paid" | "fulfilled" | "refunded"

export default function SalesPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
      paid: { label: "Paid", variant: "default" as const, icon: CheckCircle },
      fulfilled: { label: "Fulfilled", variant: "outline" as const, icon: CheckCircle },
      refunded: { label: "Refunded", variant: "destructive" as const, icon: XCircle }
    }
    
    const { label, variant, icon: Icon } = statusConfig[status]
    
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    console.log(`Updating order ${orderId} status to: ${newStatus}`)
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const handleViewOrder = (order: typeof mockOrders[0]) => {
    console.log(`Viewing order: ${order.id}`)
    setSelectedOrder(order)
    setIsOrderDetailOpen(true)
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-sales-title">
          Sales & Orders
        </h1>
        <p className="text-muted-foreground">
          Track orders, manage fulfillment, and monitor sales performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-today-revenue">
              ${mockSalesKPIs.todayRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{mockSalesKPIs.revenueGrowth}% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-today-orders">
              {mockSalesKPIs.todayOrders}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{mockSalesKPIs.ordersGrowth}% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-order-value">
              ${mockSalesKPIs.averageOrderValue}
            </div>
            <p className="text-xs text-muted-foreground">Per order today</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600" data-testid="text-pending-orders">
              {mockSalesKPIs.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage customer orders and fulfillment</CardDescription>
            </div>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 max-w-sm">
              <Label>Search Orders</Label>
              <Input
                placeholder="Search by customer, email, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-orders"
              />
            </div>
            <div>
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={(value: OrderStatus | "all") => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono" data-testid={`text-order-id-${order.id}`}>
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status as OrderStatus)}
                    </TableCell>
                    <TableCell className="font-medium" data-testid={`text-order-total-${order.id}`}>
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          data-testid={`button-view-order-${order.id}`}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "paid")}
                            data-testid={`button-mark-paid-${order.id}`}
                          >
                            Mark Paid
                          </Button>
                        )}
                        {order.status === "paid" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "fulfilled")}
                            data-testid={`button-fulfill-${order.id}`}
                          >
                            Fulfill
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "Orders will appear here when customers make purchases"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Sheet */}
      <Sheet open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
            <SheetDescription>
              {selectedOrder?.id}
            </SheetDescription>
          </SheetHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div>
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Order Status</h4>
                {getStatusBadge(selectedOrder.status as OrderStatus)}
              </div>

              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-medium">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedOrder.status === "pending" && (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, "paid")
                      setIsOrderDetailOpen(false)
                    }}
                  >
                    Mark as Paid
                  </Button>
                )}
                {selectedOrder.status === "paid" && (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, "fulfilled")
                      setIsOrderDetailOpen(false)
                    }}
                  >
                    Mark as Fulfilled
                  </Button>
                )}
                {selectedOrder.status === "fulfilled" && (
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, "refunded")
                      setIsOrderDetailOpen(false)
                    }}
                  >
                    Process Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}