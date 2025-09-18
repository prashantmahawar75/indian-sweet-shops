import { SearchFilter } from '../search-filter'

const mockCategories = ["Chocolate", "Gummy", "Hard Candy", "Caramel"]

export default function SearchFilterExample() {
  return (
    <div className="p-4">
      <SearchFilter
        onSearch={(query) => console.log('Search:', query)}
        onCategoryFilter={(category) => console.log('Category:', category)}
        onPriceFilter={(min, max) => console.log('Price:', min, max)}
        categories={mockCategories}
        activeFilters={{ category: "", priceRange: "" }}
      />
    </div>
  )
}