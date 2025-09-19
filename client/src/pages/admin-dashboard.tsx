import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Package, AlertTriangle, Ban, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Sweet {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
  description?: string;
  active: boolean;
  reorderPoint?: number;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restockLoading, setRestockLoading] = useState<string | null>(null);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">You need admin privileges to access this page.</p>
      </div>
    );
  }

  const fetchSweets = async () => {
    try {
      const response = await fetch('/api/sweets');
      const data = await response.json();
      
      if (response.ok) {
        setSweets(data);
      } else {
        throw new Error(data.message || 'Failed to fetch sweets');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to load inventory',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleRestock = async (sweetId: string, quantity: number) => {
    if (quantity <= 0) return;
    
    setRestockLoading(sweetId);
    try {
      const response = await fetch(`/api/sweets/${sweetId}/restock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to restock');
      }

      toast({
        title: "Restock Successful",
        description: `Added ${quantity} units to inventory`,
      });

      // Refresh the inventory
      fetchSweets();
    } catch (error) {
      toast({
        title: "Restock Failed",
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setRestockLoading(null);
    }
  };

  const handleDelete = async (sweetId: string) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return;

    try {
      const response = await fetch(`/api/sweets/${sweetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete');
      }

      toast({
        title: "Sweet Deleted",
        description: "The sweet has been removed from inventory",
      });

      // Refresh the inventory
      fetchSweets();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: "destructive",
      });
    }
  };

  const lowStockItems = sweets.filter(sweet => sweet.quantity <= (sweet.reorderPoint || 5));
  const outOfStockItems = sweets.filter(sweet => sweet.quantity === 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Manage your sweet shop inventory, pricing, and stock levels
          </p>
        </div>
        <Link href="/add-sweet">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Sweet
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sweets.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {lowStockItems.length}
                </p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Ban className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {outOfStockItems.length}
                </p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Manage your sweet inventory and stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sweets.map((sweet) => (
                <TableRow key={sweet.id}>
                  <TableCell className="font-medium">{sweet.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sweet.category}</Badge>
                  </TableCell>
                  <TableCell>${sweet.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={sweet.quantity === 0 ? 'text-red-500' : sweet.quantity <= (sweet.reorderPoint || 5) ? 'text-yellow-600' : 'text-green-600'}>
                        {sweet.quantity}
                      </span>
                      {sweet.quantity <= (sweet.reorderPoint || 5) && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sweet.active ? "default" : "secondary"}>
                      {sweet.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          className="w-16 h-8"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const quantity = parseInt((e.target as HTMLInputElement).value);
                              if (quantity > 0) {
                                handleRestock(sweet.id, quantity);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={restockLoading === sweet.id}
                          onClick={(e) => {
                            const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                            const quantity = parseInt(input?.value || '0');
                            if (quantity > 0) {
                              handleRestock(sweet.id, quantity);
                              if (input) input.value = '';
                            }
                          }}
                        >
                          {restockLoading === sweet.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            'Restock'
                          )}
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(sweet.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {sweets.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sweets in inventory</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first sweet to the inventory.</p>
              <Link href="/add-sweet">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sweet
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}