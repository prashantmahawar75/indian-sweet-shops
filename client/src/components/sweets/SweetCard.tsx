import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart, Package } from 'lucide-react';

interface Sweet {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
  description?: string;
  image?: string;
}

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: () => void;
}

export function SweetCard({ sweet, onPurchase }: SweetCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const handlePurchase = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/sweets/${sweet.id}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: 1 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Purchase failed');
      }

      toast({
        title: "Purchase Successful!",
        description: `You've purchased ${sweet.name}`,
      });

      onPurchase?.();
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isOutOfStock = sweet.quantity === 0;

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg mb-3 flex items-center justify-center">
          {sweet.image ? (
            <img 
              src={sweet.image} 
              alt={sweet.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Package className="h-12 w-12 text-pink-400" />
          )}
        </div>
        <CardTitle className="text-lg">{sweet.name}</CardTitle>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{sweet.category}</Badge>
          <span className="text-2xl font-bold text-primary">${sweet.price}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {sweet.description && (
          <p className="text-sm text-muted-foreground mb-3">{sweet.description}</p>
        )}
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} in stock`}
          </span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handlePurchase}
          disabled={isOutOfStock || isLoading}
          className="w-full"
          variant={isOutOfStock ? "secondary" : "default"}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}