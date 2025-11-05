import React, { useState, useEffect } from 'react'
import { Package, BarChart3, Calendar, Store } from 'lucide-react'
import Dashboard from './components/Dashboard'
import ProductManagement from './components/ProductManagement'
import BatchTracking from './components/BatchTracking'
import Analytics from './components/Analytics'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [batches, setBatches] = useState([])
  const [openProductForm, setOpenProductForm] = useState(false)
  const [openBatchForm, setOpenBatchForm] = useState(false)

  // ---------- Helpers ----------
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  const toYMD = (d) => new Date(d).toISOString().slice(0, 10)

  // ---------- 120+ sample products ----------
  const sampleProducts = [
    // Dairy
    { name: 'Whole Milk 1L', category: 'Dairy', shelfLife: 7 },
    { name: 'Skim Milk 1L', category: 'Dairy', shelfLife: 7 },
    { name: 'Organic Milk 1L', category: 'Dairy', shelfLife: 10 },
    { name: 'Chocolate Milk 1L', category: 'Dairy', shelfLife: 10 },
    { name: 'Greek Yogurt 500g', category: 'Dairy', shelfLife: 21 },
    { name: 'Plain Yogurt 1kg', category: 'Dairy', shelfLife: 21 },
    { name: 'Cheddar Cheese 200g', category: 'Dairy', shelfLife: 90 },
    { name: 'Mozzarella Cheese 200g', category: 'Dairy', shelfLife: 60 },
    { name: 'Butter 200g', category: 'Dairy', shelfLife: 120 },
    { name: 'Paneer 200g', category: 'Dairy', shelfLife: 10 },
    { name: 'Cottage Cheese 400g', category: 'Dairy', shelfLife: 14 },
    { name: 'Cream 200ml', category: 'Dairy', shelfLife: 10 },
    { name: 'Eggs 12-pack', category: 'Dairy', shelfLife: 21 },
    { name: 'Eggs 6-pack', category: 'Dairy', shelfLife: 21 },
    // Beverages (non-alcohol)
    { name: 'Orange Juice 1L', category: 'Beverages', shelfLife: 20 },
    { name: 'Apple Juice 1L', category: 'Beverages', shelfLife: 20 },
    { name: 'Cola 2L', category: 'Beverages', shelfLife: 180 },
    { name: 'Lemon Soda 500ml', category: 'Beverages', shelfLife: 180 },
    { name: 'Iced Tea 1L', category: 'Beverages', shelfLife: 180 },
    { name: 'Energy Drink 250ml', category: 'Beverages', shelfLife: 365 },
    { name: 'Coconut Water 1L', category: 'Beverages', shelfLife: 180 },
    { name: 'Sparkling Water 1L', category: 'Beverages', shelfLife: 365 },
    { name: 'Mineral Water 1L', category: 'Beverages', shelfLife: 365 },
    { name: 'Cold Brew Coffee 300ml', category: 'Beverages', shelfLife: 30 },
    // Liquor
    { name: 'Whiskey 750ml', category: 'Liquor', shelfLife: 3650 },
    { name: 'Vodka 750ml', category: 'Liquor', shelfLife: 3650 },
    { name: 'Rum 750ml', category: 'Liquor', shelfLife: 3650 },
    { name: 'Gin 750ml', category: 'Liquor', shelfLife: 3650 },
    { name: 'Tequila 750ml', category: 'Liquor', shelfLife: 3650 },
    { name: 'Red Wine 750ml', category: 'Liquor', shelfLife: 1825 },
    { name: 'White Wine 750ml', category: 'Liquor', shelfLife: 1460 },
    { name: 'Beer 6-pack 330ml', category: 'Liquor', shelfLife: 180 },
    { name: 'Craft IPA 4-pack 440ml', category: 'Liquor', shelfLife: 150 },
    { name: 'Cider 6-pack 330ml', category: 'Liquor', shelfLife: 180 },
    // Bakery
    { name: 'White Bread Loaf', category: 'Bakery', shelfLife: 5 },
    { name: 'Whole Wheat Bread Loaf', category: 'Bakery', shelfLife: 6 },
    { name: 'Multigrain Bread', category: 'Bakery', shelfLife: 6 },
    { name: 'Bagels 4-pack', category: 'Bakery', shelfLife: 5 },
    { name: 'Croissants 4-pack', category: 'Bakery', shelfLife: 4 },
    { name: 'Brioche Buns 6-pack', category: 'Bakery', shelfLife: 5 },
    { name: 'English Muffins 6-pack', category: 'Bakery', shelfLife: 5 },
    { name: 'Tortillas 10-pack', category: 'Bakery', shelfLife: 14 },
    // Produce
    { name: 'Apples 1kg', category: 'Produce', shelfLife: 30 },
    { name: 'Bananas 1kg', category: 'Produce', shelfLife: 7 },
    { name: 'Oranges 1kg', category: 'Produce', shelfLife: 20 },
    { name: 'Tomatoes 1kg', category: 'Produce', shelfLife: 7 },
    { name: 'Potatoes 2kg', category: 'Produce', shelfLife: 60 },
    { name: 'Onions 1kg', category: 'Produce', shelfLife: 45 },
    { name: 'Garlic 250g', category: 'Produce', shelfLife: 60 },
    { name: 'Ginger 250g', category: 'Produce', shelfLife: 21 },
    { name: 'Spinach Bunch', category: 'Produce', shelfLife: 5 },
    { name: 'Carrots 1kg', category: 'Produce', shelfLife: 30 },
    { name: 'Broccoli 500g', category: 'Produce', shelfLife: 7 },
    { name: 'Cucumber 500g', category: 'Produce', shelfLife: 7 },
    { name: 'Strawberries 250g', category: 'Produce', shelfLife: 5 },
    { name: 'Blueberries 125g', category: 'Produce', shelfLife: 7 },
    { name: 'Mushrooms 200g', category: 'Produce', shelfLife: 5 },
    { name: 'Lettuce Head', category: 'Produce', shelfLife: 7 },
    { name: 'Avocado 2-pack', category: 'Produce', shelfLife: 5 },
    // Snacks
    { name: 'Potato Chips 150g', category: 'Snacks', shelfLife: 180 },
    { name: 'Tortilla Chips 200g', category: 'Snacks', shelfLife: 180 },
    { name: 'Chocolate Cookies 200g', category: 'Snacks', shelfLife: 270 },
    { name: 'Oatmeal Cookies 200g', category: 'Snacks', shelfLife: 270 },
    { name: 'Salted Peanuts 200g', category: 'Snacks', shelfLife: 300 },
    { name: 'Trail Mix 300g', category: 'Snacks', shelfLife: 300 },
    { name: 'Granola Bars 6-pack', category: 'Snacks', shelfLife: 270 },
    { name: 'Popcorn 3-pack', category: 'Snacks', shelfLife: 365 },
    { name: 'Crackers 200g', category: 'Snacks', shelfLife: 270 },
    // Frozen
    { name: 'Frozen Peas 500g', category: 'Frozen', shelfLife: 365 },
    { name: 'Frozen Corn 500g', category: 'Frozen', shelfLife: 365 },
    { name: 'Frozen Mixed Veg 1kg', category: 'Frozen', shelfLife: 365 },
    { name: 'Frozen Pizza', category: 'Frozen', shelfLife: 180 },
    { name: 'Ice Cream 1L', category: 'Frozen', shelfLife: 180 },
    { name: 'Frozen Chicken Nuggets 1kg', category: 'Frozen', shelfLife: 365 },
    { name: 'Frozen Fish Fillets 500g', category: 'Frozen', shelfLife: 365 },
    // Meat
    { name: 'Chicken Breast 500g', category: 'Meat', shelfLife: 5 },
    { name: 'Chicken Thighs 500g', category: 'Meat', shelfLife: 5 },
    { name: 'Lean Ground Beef 500g', category: 'Meat', shelfLife: 3 },
    { name: 'Beef Steak 400g', category: 'Meat', shelfLife: 5 },
    { name: 'Pork Chops 500g', category: 'Meat', shelfLife: 5 },
    { name: 'Bacon 250g', category: 'Meat', shelfLife: 14 },
    { name: 'Sausages 400g', category: 'Meat', shelfLife: 14 },
    // Seafood
    { name: 'Salmon Fillet 300g', category: 'Seafood', shelfLife: 3 },
    { name: 'Shrimp 500g', category: 'Seafood', shelfLife: 5 },
    { name: 'Tuna Steak 300g', category: 'Seafood', shelfLife: 3 },
    { name: 'Mackerel 400g', category: 'Seafood', shelfLife: 3 },
    // Pantry
    { name: 'Basmati Rice 5kg', category: 'Pantry', shelfLife: 365 },
    { name: 'Brown Rice 2kg', category: 'Pantry', shelfLife: 365 },
    { name: 'Pasta Penne 500g', category: 'Pantry', shelfLife: 365 },
    { name: 'Pasta Spaghetti 500g', category: 'Pantry', shelfLife: 365 },
    { name: 'All-purpose Flour 1kg', category: 'Pantry', shelfLife: 240 },
    { name: 'Whole Wheat Flour 1kg', category: 'Pantry', shelfLife: 180 },
    { name: 'Sugar 1kg', category: 'Pantry', shelfLife: 730 },
    { name: 'Brown Sugar 1kg', category: 'Pantry', shelfLife: 365 },
    { name: 'Salt 1kg', category: 'Pantry', shelfLife: 1460 },
    { name: 'Olive Oil 1L', category: 'Pantry', shelfLife: 365 },
    { name: 'Sunflower Oil 1L', category: 'Pantry', shelfLife: 365 },
    { name: 'Canned Tomatoes 400g', category: 'Pantry', shelfLife: 540 },
    { name: 'Canned Chickpeas 400g', category: 'Pantry', shelfLife: 540 },
    { name: 'Canned Kidney Beans 400g', category: 'Pantry', shelfLife: 540 },
    { name: 'Peanut Butter 500g', category: 'Pantry', shelfLife: 365 },
    { name: 'Jam Strawberry 350g', category: 'Pantry', shelfLife: 365 },
    { name: 'Honey 500g', category: 'Pantry', shelfLife: 1460 },
    { name: 'Instant Noodles 5-pack', category: 'Pantry', shelfLife: 365 },
    { name: 'Breakfast Cereal 500g', category: 'Pantry', shelfLife: 365 },
    { name: 'Oats 1kg', category: 'Pantry', shelfLife: 365 },
    { name: 'Yeast 50g', category: 'Pantry', shelfLife: 180 },
    { name: 'Baking Powder 100g', category: 'Pantry', shelfLife: 365 },
    { name: 'Cocoa Powder 200g', category: 'Pantry', shelfLife: 365 },
    { name: 'Pasta Sauce 400g', category: 'Pantry', shelfLife: 365 },
    { name: 'Ketchup 500g', category: 'Pantry', shelfLife: 365 },
    { name: 'Mayonnaise 400g', category: 'Pantry', shelfLife: 180 },
    { name: 'Mustard 200g', category: 'Pantry', shelfLife: 365 },
    { name: 'Soya Sauce 500ml', category: 'Pantry', shelfLife: 365 },
    // Household
    { name: 'Laundry Detergent 1L', category: 'Household', shelfLife: 1095 },
    { name: 'Dishwashing Liquid 750ml', category: 'Household', shelfLife: 1095 },
    { name: 'Surface Cleaner 1L', category: 'Household', shelfLife: 1095 },
    { name: 'Paper Towels 6-pack', category: 'Household', shelfLife: 3650 },
    { name: 'Toilet Paper 12-pack', category: 'Household', shelfLife: 3650 },
    { name: 'Garbage Bags 30-pack', category: 'Household', shelfLife: 3650 },
    { name: 'Aluminum Foil 25m', category: 'Household', shelfLife: 3650 },
    // Personal Care
    { name: 'Shampoo 400ml', category: 'Personal Care', shelfLife: 365 },
    { name: 'Conditioner 400ml', category: 'Personal Care', shelfLife: 365 },
    { name: 'Body Wash 500ml', category: 'Personal Care', shelfLife: 365 },
    { name: 'Toothpaste 150g', category: 'Personal Care', shelfLife: 730 },
    { name: 'Toothbrush 2-pack', category: 'Personal Care', shelfLife: 3650 },
    { name: 'Hand Soap 250ml', category: 'Personal Care', shelfLife: 365 },
    { name: 'Deodorant 150ml', category: 'Personal Care', shelfLife: 365 },
    { name: 'Lotion 250ml', category: 'Personal Care', shelfLife: 365 },
    // Extra to surpass 120 items
    { name: 'Brown Bread Loaf', category: 'Bakery', shelfLife: 6 },
    { name: 'Sourdough Bread', category: 'Bakery', shelfLife: 6 },
    { name: 'Mango Juice 1L', category: 'Beverages', shelfLife: 30 },
    { name: 'Grape Juice 1L', category: 'Beverages', shelfLife: 30 },
    { name: 'Protein Bar 12-pack', category: 'Snacks', shelfLife: 270 },
    { name: 'Mixed Nuts 200g', category: 'Snacks', shelfLife: 300 },
    { name: 'Frozen Fries 1kg', category: 'Frozen', shelfLife: 365 },
    { name: 'Frozen Berries 500g', category: 'Frozen', shelfLife: 365 },
    { name: 'Green Tea 100 bags', category: 'Pantry', shelfLife: 365 },
    { name: 'Black Tea 100 bags', category: 'Pantry', shelfLife: 365 },
    { name: 'Coffee Beans 1kg', category: 'Pantry', shelfLife: 365 },
    { name: 'Ground Coffee 500g', category: 'Pantry', shelfLife: 365 },
    { name: 'Almond Milk 1L', category: 'Beverages', shelfLife: 180 },
    { name: 'Soy Milk 1L', category: 'Beverages', shelfLife: 180 },
    { name: 'Lassi 1L', category: 'Dairy', shelfLife: 10 },
    { name: 'Buttermilk 1L', category: 'Dairy', shelfLife: 10 },
    { name: 'Raisins 250g', category: 'Pantry', shelfLife: 365 },
    { name: 'Dates 500g', category: 'Pantry', shelfLife: 365 },
    { name: 'Cashews 250g', category: 'Pantry', shelfLife: 365 },
    { name: 'Pistachios 250g', category: 'Pantry', shelfLife: 365 },
    { name: 'Sunflower Seeds 250g', category: 'Pantry', shelfLife: 365 },
    { name: 'Chia Seeds 300g', category: 'Pantry', shelfLife: 365 },
    { name: 'Quinoa 1kg', category: 'Pantry', shelfLife: 365 },
    { name: 'Couscous 1kg', category: 'Pantry', shelfLife: 365 },
    { name: 'Maple Syrup 250ml', category: 'Pantry', shelfLife: 365 },
    { name: 'Hot Sauce 200ml', category: 'Pantry', shelfLife: 365 },
    { name: 'BBQ Sauce 500ml', category: 'Pantry', shelfLife: 365 },
    { name: 'Pickles 500g', category: 'Pantry', shelfLife: 365 },
    { name: 'Kimchi 400g', category: 'Pantry', shelfLife: 120 },
  ]

  function seedSampleData() {
    const now = new Date()
    const prods = sampleProducts.map((p, idx) => ({
      id: `P${idx + 1}`,
      name: p.name,
      category: p.category,
      barcode: String(100000000000 + idx),
      shelfLife: p.shelfLife
    }))

    const bchs = []
    for (const p of prods) {
      const batchesForP = randInt(1, 3)
      for (let j = 0; j < batchesForP; j++) {
        const maxFuture = Math.min(180, p.shelfLife)
        const offsetDays = randInt(-30, Math.max(7, maxFuture))
        const exp = new Date(now)
        exp.setDate(exp.getDate() + offsetDays)
        bchs.push({
          id: `B-${p.id}-${j + 1}`,
          productId: p.id,
          quantity: randInt(5, 50),
          expiryDate: toYMD(exp),
          location: ['Front Shelf', 'Back Shelf', 'Cold Storage', 'Warehouse'][randInt(0, 3)]
        })
      }
    }
    return { prods, bchs }
  }

  // Reset demo data (clears storage and reseeds)
  const handleResetDemoData = () => {
    if (typeof window === 'undefined') return
    // simple confirm to avoid mis-clicks
    // eslint-disable-next-line no-alert
    const ok = window.confirm('Reset demo data? This will replace current products & batches.')
    if (!ok) return
    const { prods, bchs } = seedSampleData()
    setProducts(prods)
    setBatches(bchs)
    localStorage.setItem('retailsmart-products', JSON.stringify(prods))
    localStorage.setItem('retailsmart-batches', JSON.stringify(bchs))
    setCurrentView('dashboard')
  }

  // Load / seed on first run
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const savedProducts = localStorage.getItem('retailsmart-products')
      const savedBatches = localStorage.getItem('retailsmart-batches')
      if (savedProducts && savedBatches) {
        setProducts(JSON.parse(savedProducts))
        setBatches(JSON.parse(savedBatches))
      } else {
        const { prods, bchs } = seedSampleData()
        setProducts(prods)
        setBatches(bchs)
        localStorage.setItem('retailsmart-products', JSON.stringify(prods))
        localStorage.setItem('retailsmart-batches', JSON.stringify(bchs))
      }
    } catch {
      const { prods, bchs } = seedSampleData()
      setProducts(prods)
      setBatches(bchs)
    }
  }, [])

  // Persist
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('retailsmart-products', JSON.stringify(products))
  }, [products])
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('retailsmart-batches', JSON.stringify(batches))
  }, [batches])

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'batches', label: 'Batches', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: Store },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">RetailSmart</h1>
            </div>
            <nav className="flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      currentView === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {currentView === 'dashboard' && (
            <Dashboard
              products={products}
              batches={batches}
              onAddProduct={() => { setCurrentView('products'); setOpenProductForm(true) }}
              onAddBatch={() => { setCurrentView('batches'); setOpenBatchForm(true) }}
              onViewAnalytics={() => setCurrentView('analytics')}
              onResetDemoData={handleResetDemoData}   // <-- new
            />
          )}
          {currentView === 'products' && (
            <ProductManagement
              products={products}
              setProducts={setProducts}
              defaultOpenForm={openProductForm}
              onCloseForm={() => setOpenProductForm(false)}
            />
          )}
          {currentView === 'batches' && (
            <BatchTracking
              batches={batches}
              setBatches={setBatches}
              products={products}
              defaultOpenForm={openBatchForm}
              onCloseForm={() => setOpenBatchForm(false)}
            />
          )}
          {currentView === 'analytics' && (
            <Analytics products={products} batches={batches} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
