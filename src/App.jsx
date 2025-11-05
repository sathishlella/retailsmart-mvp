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

  // safe JSON parse helper
  const safeParse = (val, fallback) => {
    try {
      const out = JSON.parse(val)
      return Array.isArray(out) ? out : fallback
    } catch {
      return fallback
    }
  }

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedProducts = localStorage.getItem('retailsmart-products')
    const savedBatches = localStorage.getItem('retailsmart-batches')
    if (savedProducts) setProducts(safeParse(savedProducts, []))
    if (savedBatches) setBatches(safeParse(savedBatches, [])) // fixed: setBatches
  }, [])

  // Persist to localStorage
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {currentView === 'dashboard' && (
            <Dashboard products={products} batches={batches} />
          )}
          {currentView === 'products' && (
            <ProductManagement products={products} setProducts={setProducts} />
          )}
          {currentView === 'batches' && (
            <BatchTracking
              batches={batches}
              setBatches={setBatches}
              products={products}
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
