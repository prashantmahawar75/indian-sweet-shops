import { SweetCard } from '../sweet-card'

const mockSweet = {
  id: "1",
  name: "Dark Chocolate Truffle",
  category: "Chocolate",
  price: 15.99,
  quantity: 25
}

export default function SweetCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <SweetCard 
        sweet={mockSweet}
        onPurchase={(id) => console.log('Purchase:', id)}
      />
    </div>
  )
}