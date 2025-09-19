import { useState, useEffect } from "react";
import { SweetCard } from "@/components/sweets/SweetCard";
import { SweetSearch } from "@/components/sweets/SweetSearch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface Sweet {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
  description?: string;
  image?: string;
}

interface SearchFilters {
  query: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}

export default function Dashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSweets = async (filters?: SearchFilters) => {
    try {
      setSearchLoading(true);
      let url = '/api/sweets';
      const params = new URLSearchParams();

      if (filters?.query) {
        url = '/api/sweets/search';
        params.append('q', filters.query);
      }

      if (filters?.category) params.append('category', filters.category);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice);
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters?.inStock) params.append('inStock', 'true');

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setFilteredSweets(data);
        if (!filters) {
          setSweets(data);
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.map((sweet: Sweet) => sweet.category)));
          setCategories(uniqueCategories);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch sweets');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to load sweets',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    fetchSweets(filters);
  };

  const handleCategoryFilter = (category: string) => {
    fetchSweets({ query: '', category, minPrice: '', maxPrice: '', inStock: false });
  };

  const handlePurchaseSuccess = () => {
    // Refresh the sweets list to get updated quantities
    fetchSweets();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
        <div className="h-64 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center text-center text-white">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Sweet Shop Paradise
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Discover our premium collection of artisanal sweets and candies
              </p>
              {user && (
                <p className="text-lg mt-2 opacity-80">
                  Welcome back, {user.username}! 🍭
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.slice(0, 6).map((category) => (
          <Badge 
            key={category}
            variant="outline" 
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm px-4 py-2"
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Search and Filter */}
      <SweetSearch
        onSearch={handleSearch}
        categories={categories}
        isLoading={searchLoading}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Our Sweet Collection
        </h2>
        <div className="text-muted-foreground">
          Showing {filteredSweets.length} sweets
        </div>
      </div>

      {/* Sweet Cards Grid */}
      {searchLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onPurchase={handlePurchaseSuccess}
            />
          ))}
        </div>
      )}

      {filteredSweets.length === 0 && !searchLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍭</div>
          <h3 className="text-xl font-semibold mb-2">No sweets found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}