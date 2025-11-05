import React, { useState, useEffect, useMemo } from 'react'
import { Package, BarChart3, Calendar, Store, Shirt, ShoppingBag } from 'lucide-react'
import Dashboard from './components/Dashboard'
import ProductManagement from './components/ProductManagement'
import BatchTracking from './components/BatchTracking'
import Analytics from './components/Analytics'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [batches, setBatches] = useState([])
  const [storeMode, setStoreMode] = useState('grocery') // 'grocery' | 'fashion'
  const [listFilter, setListFilter] = useState(null)
  const [openProductForm, setOpenProductForm] = useState(false)
  const [openBatchForm, setOpenBatchForm] = useState(false)

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  const toYMD = (d) => new Date(d).toISOString().slice(0, 10)
  const daysUntil = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
  const isFashion = storeMode === 'fashion'

  // -------------------------------
  // SAMPLE PRODUCT SETS
  // -------------------------------
  const groceryProducts = [
    { name: 'Whole Milk 1L', category: 'Dairy', shelfLife: 7 },
    { name: 'Eggs 12-pack', category: 'Dairy', shelfLife: 21 },
    { name: 'Bread Loaf', category: 'Bakery', shelfLife: 5 },
    { name: 'Butter 200g', category: 'Dairy', shelfLife: 120 },
    { name: 'Yogurt 500g', category: 'Dairy', shelfLife: 14 },
    { name: 'Apples 1kg', category: 'Produce', shelfLife: 30 },
    { name: 'Bananas 1kg', category: 'Produce', shelfLife: 7 },
    { name: 'Chicken Breast 500g', category: 'Meat', shelfLife: 5 },
    { name: 'Fish Fillet 300g', category: 'Seafood', shelfLife: 5 },
    { name: 'Rice 5kg', category: 'Pantry', shelfLife: 365 },
    { name: 'Olive Oil 1L', category: 'Pantry', shelfLife: 365 },
    { name: 'Potato Chips 200g', category: 'Snacks', shelfLife: 270 },
    { name: 'Orange Juice 1L', category: 'Beverages', shelfLife: 20 },
    { name: 'Beer 6-pack', category: 'Liquor', shelfLife: 180 },
    { name: 'Ice Cream 1L', category: 'Frozen', shelfLife: 180 },
  ]

  const fashionProducts = [
    { name: 'Denim Jeans', category: 'Clothing', shelfLife: 1460 },
    { name: 'Cotton T-Shirt', category: 'Clothing', shelfLife: 1095 },
    { name: 'Leather Jacket', category: 'Clothing', shelfLife: 1825 },
    { name: 'Summer Dress', category: 'Clothing', shelfLife: 730 },
    { name: 'Formal Shirt', category: 'Clothing', shelfLife: 1460 },
    { name: 'Sneakers', category: 'Footwear', shelfLife: 1095 },
    { name: 'Leather Shoes', category: 'Footwear', shelfLife: 1460 },
    { name: 'Heels', category: 'Footwear', shelfLife: 1095 },
    { name: 'Running Shoes', category: 'Footwear', shelfLife: 1095 },
    { name: 'Necklace', category: 'Jewelry', shelfLife: 3650 },
    { name: 'Bracelet', category: 'Jewelry', shelfLife: 3650 },
    { name: 'Earrings', category: 'Jewelry', shelfLife: 3650 },
    { name: 'Sunglasses', category: 'Accessories', shelfLife: 1825 },
    { name: 'Watch', category: 'Accessories', shelfLife: 1825 },
    { name: 'Handbag', category: 'Accessories', shelfLife: 1825 },
  ]

  // -------------------------------
  // SEEDING DEMO DATA
  // -------------------------------
  const seedSampleData = (mode = 'grocery') => {
    const source = mode === 'fashion' ? fashionProducts : groceryProducts
    const prods = source.map((p, idx) => ({
      id: `P${idx + 1}`,
      name: p.name,
      category: p.category,
      barcode: String(1000000000 + idx),
      shelfLife: p.shelfLife,
    }))
    const locs = ['Front Shelf', 'Back Shelf', 'Warehouse', 'Online Stock']
    const bchs = []
    const now = new Date()
    for (const p of prods) {
      const batchesForP = randInt(1, 3)
      for (let j = 0; j < batchesForP; j++) {
        const offset = randInt(-30, p.shelfLife > 60 ? 90 : p.shelfLife)
        const exp = new Date(now)
        exp.setDate(exp.getDate() + offset)
        bchs.push({
          id: `B-${p.id}-${j + 1}`,
          productId: p.id,
          quantity: randInt(1, 20),
          // Keep field name "expiryDate" for code reuse; we rename in UI to "Season End" for fashion
          expiryDate: toYMD(exp),
          location: locs[randInt(0, locs.length - 1)],
        })
      }
    }
    return { prods, bchs }
  }

  const handleResetDemoData = (mode = storeMode) => {
    const { prods, bchs } = seedSampleData(mode)
    setProducts(prods)
    setBatches(bchs)
    localStorage.setItem('retailsmart-products', JSON.stringify(prods))
    localStorage.setItem('retailsmart-batches', JSON.stringify(bchs))
  }

  // Initial load
  useEffect(() => {
    const savedProducts = localStorage.getItem('retailsmart-products')
    const savedBatches = localStorage.getItem('retailsmart-batches')
    if (savedProducts && savedBatches) {
      setProducts(JSON.parse(savedProducts))
      setBatches(JSON.parse(savedBatches))
    } else {
      handleResetDemoData('grocery')
    }
  }, [])

  // Persist changes
  useEffect(() => {
    localStorage.setItem('retailsmart-products', JSON.stringify(products))
  }, [products])
  useEffect(() => {
    localStorage.setItem('retailsmart-batches', JSON.stringify(batches))
  }, [batches])

  // ----------------------------------
  // Derived lists for dashboard clicks
  // ----------------------------------
  const expiringSoonBatches = useMemo(() => batches.filter(b => {
    const d = daysUntil(b.expiryDate)
    return d <= 7 && d > 0
  }), [batches])
  const expiredBatches = useMemo(() => batches.filter(b => daysUntil(b.expiryDate) < 0), [batches])
  const productsAtRiskSoonIds = useMemo(
    () => Array.from(new Set(expiringSoonBatches.map(b => String(b.productId)))),
    [expiringSoonBatches]
  )
  const productsWithExpiredIds = useMemo(
    () => Array.from(new Set(expiredBatches.map(b => String(b.productId)))),
    [expiredBatches]
  )

  // --------- Dashboard click handlers (mode-aware labels) ---------
  const openAllProducts = () => { setListFilter({ target: 'products', ids: null, label: null }); setCurrentView('products') }
  const openAllBatches = () => { setListFilter({ target: 'batches', type: null, label: null }); setCurrentView('batches') }
  const openProductsAtRiskSoon = () => {
    setListFilter({
      target: 'products',
      ids: productsAtRiskSoonIds,
      label: isFashion ? 'Products with items going off-season within 7 days'
                       : 'Products with batches expiring within 7 days'
    })
    setCurrentView('products')
  }
  const openProductsWithExpired = () => {
    setListFilter({
      target: 'products',
      ids: productsWithExpiredIds,
      label: isFashion ? 'Products with out-of-season items'
                       : 'Products with expired batches'
    })
    setCurrentView('products')
  }
  const openBatchesExpiringSoon = () => {
    setListFilter({
      target: 'batches',
      type: 'expiringSoon',
      label: isFashion ? 'Items going off-season within 7 days'
                       : 'Batches expiring within 7 days'
    })
    setCurrentView('batches')
  }
  const openBatchesExpired = () => {
    setListFilter({
      target: 'batches',
      type: 'expired',
      label: isFashion ? 'Out-of-season items'
                       : 'Expired batches'
    })
    setCurrentView('batches')
  }
  const clearFilter = () => setListFilter(null)

  // ----------------------------------
  // NAVIGATION + MODE SWITCH
  // ----------------------------------
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'batches', label: 'Batches', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: Store },
  ]

  const toggleMode = () => {
    const newMode = storeMode === 'grocery' ? 'fashion' : 'grocery'
    setStoreMode(newMode)
    handleResetDemoData(newMode)
    setCurrentView('dashboard')
    setListFilter(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {isFashion ? (
                <Shirt className="h-7 w-7 text-pink-600" />
              ) : (
                <ShoppingBag className="h-7 w-7 text-blue-600" />
              )}
              <h1 className="text-xl font-bold text-gray-900">
                RetailSmart — {isFashion ? 'Fashion Store' : 'Grocery Store'}
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              {/* Toggle switch */}
              <label className="flex items-center cursor-pointer">
                <span className="mr-2 text-sm font-medium text-gray-700">Mode:</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isFashion}
                    onChange={toggleMode}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-pink-500 transition-all"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-all"></div>
                </div>
                <span className="ml-2 text-sm text-gray-700">
                  {isFashion ? 'Fashion' : 'Grocery'}
                </span>
              </label>
              <nav className="flex space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setCurrentView(item.id); setListFilter(null) }}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        currentView === item.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1" />{item.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {currentView === 'dashboard' && (
            <Dashboard
              storeMode={storeMode}
              products={products}
              batches={batches}
              onAddProduct={() => { setCurrentView('products'); setOpenProductForm(true) }}
              onAddBatch={() => { setCurrentView('batches'); setOpenBatchForm(true) }}
              onViewAnalytics={() => setCurrentView('analytics')}
              onResetDemoData={() => handleResetDemoData(storeMode)}
              onOpenAllProducts={openAllProducts}
              onOpenAllBatches={openAllBatches}
              onOpenProductsAtRiskSoon={openProductsAtRiskSoon}
              onOpenProductsWithExpired={openProductsWithExpired}
              onOpenBatchesExpiringSoon={openBatchesExpiringSoon}
              onOpenBatchesExpired={openBatchesExpired}
            />
          )}
          {currentView === 'products' && (
            <ProductManagement
              products={products}
              setProducts={setProducts}
              defaultOpenForm={openProductForm}
              onCloseForm={() => setOpenProductForm(false)}
              productIdFilter={listFilter?.target === 'products' ? listFilter?.ids : null}
              filterLabel={listFilter?.target === 'products' ? listFilter?.label : null}
              onClearFilter={clearFilter}
            />
          )}
          {currentView === 'batches' && (
            <BatchTracking
              storeMode={storeMode}
              batches={batches}
              setBatches={setBatches}
              products={products}
              defaultOpenForm={openBatchForm}
              onCloseForm={() => setOpenBatchForm(false)}
              filterMode={listFilter?.target === 'batches' ? listFilter?.type : null}
              filterLabel={listFilter?.target === 'batches' ? listFilter?.label : null}
              onClearFilter={clearFilter}
            />
          )}
          {currentView === 'analytics' && (
            <Analytics storeMode={storeMode} products={products} batches={batches} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
