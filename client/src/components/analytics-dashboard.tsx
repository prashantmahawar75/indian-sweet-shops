import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Package, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react"

// Mock analytics data - todo: remove mock functionality
const mockAnalytics = {
  totalRevenue: 12450.75,
  totalSales: 342,
  totalProducts: 48,
  lowStockItems: 7,
  revenueGrowth: 15.2,
  salesGrowth: 8.7,
  topSellingSweets: [
    { name: "Chocolate Truffle", sales: 45, revenue: 675 },
    { name: "Gummy Bears", sales: 38, revenue: 456 },
    { name: "Caramel Delight", sales: 32, revenue: 480 },
    { name: "Strawberry Lollipop", sales: 28, revenue: 140 },
  ],
  categoryBreakdown: [
    { category: "Chocolate", percentage: 35, revenue: 4357.5 },
    { category: "Gummy", percentage: 25, revenue: 3112.5 },
    { category: "Hard Candy", percentage: 20, revenue: 2490 },
    { category: "Caramel", percentage: 12, revenue: 1494 },
    { category: "Premium", percentage: 8, revenue: 996 },
  ],
  recentActivity: [
    { action: "Sale", item: "Dark Chocolate Truffle", amount: "$15.00", time: "2 minutes ago" },
    { action: "Restock", item: "Rainbow Gummies", amount: "+50 units", time: "1 hour ago" },
    { action: "Sale", item: "Caramel Squares", amount: "$8.50", time: "3 hours ago" },
    { action: "Low Stock Alert", item: "Mint Chocolates", amount: "3 remaining", time: "5 hours ago" },
  ]
}

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-revenue">
              ${mockAnalytics.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{mockAnalytics.revenueGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-sales">
              {mockAnalytics.totalSales}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{mockAnalytics.salesGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-products">
              {mockAnalytics.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600" data-testid="text-low-stock-count">
              {mockAnalytics.lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Selling Sweets
            </CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.topSellingSweets.map((sweet, index) => (
                <div key={sweet.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium" data-testid={`text-top-sweet-${index}`}>{sweet.name}</p>
                      <p className="text-sm text-muted-foreground">{sweet.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${sweet.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Revenue breakdown by sweet category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.categoryBreakdown.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-muted-foreground">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">
                      ${category.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and inventory updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAnalytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover-elevate">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={
                      activity.action === "Sale" ? "default" :
                      activity.action === "Restock" ? "secondary" :
                      "destructive"
                    }
                  >
                    {activity.action}
                  </Badge>
                  <div>
                    <p className="font-medium">{activity.item}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    activity.action === "Sale" ? "text-green-600" :
                    activity.action === "Restock" ? "text-blue-600" :
                    "text-yellow-600"
                  }`}>
                    {activity.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}