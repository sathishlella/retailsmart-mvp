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

  // --------------------
  // Sample data seeding
  // --------------------
  const categories = [
    'Dairy','Beverages','Bakery','Produce','Snacks','Frozen',
    'Meat','Seafood','Pantry','Household','Personal Care'
  ]
  const locations = ['Front Shelf','Back Shelf','Cold Storage','Warehouse']

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  const randomBarcode = () =>
    Array.from({ length: 12 }, () => randInt(0, 9)).join('')

  const addDays = (date, days) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }
  const toYMD = (d) => new Date(d).toISOString().slice(0, 10)

  function seedSampleData(count = 100) {
    const nouns = [
      'Milk','Yogurt','Juice','Cola','Bread','Buns','Croissant','Apple','Banana','Tomato',
      'Chips','Cookies','Cereal','Rice','Pasta','Ice Cream','Chicken','Beef','Salmon',
      'Shampoo','Soap','Detergent','Toothpaste','Tea','Coffee','Water','Cheese','Butter','Eggs'
    ]
    const prods = []
    for (let i = 1; i <= count; i++) {
      const noun = nouns[randInt(0, nouns.length - 1)]
      const category = categories[randInt(0, categories.length - 1)]
      prods.push({
        id: `P${Date.now()}_${i}`,
        name: `${noun} ${i}`,
        barcode: randomBarcode(),
        category,
        // 7–120 days
        shelfLife: randInt(7, 120)
      })
    }

    const bchs = []
    const now = new Date()
    for (const p of prods) {
      const batchesForP = randInt(1, 3)
      for (let j = 0; j < batchesForP; j++) {
        // Offset expiry between -30 and +120 days to ensure variety
        const offsetDays = randInt(-30, 120)
        const expiry = toYMD(addDays(now, offsetDays))
        bchs.push({
          id: `B${p.id}_${j}_${randInt(1000, 9999)}`,
          productId: p.id,
          quantity: randInt(5, 50),
          expiryDate: expiry,
          location: locations[randInt(0, locations.length - 1)]
        })
      }
    }
    return { prods, bchs }
  }

  // Load from localStorage; seed if empty
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const savedProducts = localStorage.getItem('retailsmart-products')
      const savedBatches = localStorage.getItem('retailsmart-batches')

      if (savedProducts && savedBatches) {
        setProducts(JSON.parse(savedProducts))
        setBatches(JSON.parse(savedBatches))
      } else {
        const { prods, bchs } = seedSampleData(100)
        setProducts(prods)
        setBatches(bchs)
        localStorage.setItem('retailsmart-products', JSON.stringify(prods))
        localStorage.setItem('retailsmart-batches', JSON.stringify(bchs))
      }
    } catch {
      const { prods, bchs } = seedSampleData(100)
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
