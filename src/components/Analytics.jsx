import React from 'react'
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react'

const Analytics = ({ products, batches }) => {
  // Calculate analytics
  const totalProducts = products.length
  const totalBatches = batches.length
  
  const expiredBatches = batches.filter(batch => {
    const expiryDate = new Date(batch.expiryDate)
    return expiryDate < new Date()
  })

  const expiringSoon = batches.filter(batch => {
    const expiryDate = new Date(batch.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  })

  const goodBatches = batches.filter(batch => {
    const expiryDate = new Date(batch.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry > 7
  })

  // Calculate waste cost (example: $5 per expired item)
  const estimatedWasteCost = expiredBatches.reduce((total, batch) => {
    return total + (batch.quantity * 5) // $5 per item
  }, 0)

  // Category distribution
  const categoryDistribution = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {})

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      change: '+12%',
      changeType: 'increase',
      icon: Package
    },
    {
      label: 'Active Batches',
      value: totalBatches,
      change: '+8%',
      changeType: 'increase',
      icon: TrendingUp
    },
    {
      label: 'Waste Prevention',
      value: `$${estimatedWasteCost}`,
      change: 'Potential savings',
      changeType: 'neutral',
      icon: DollarSign
    },
    {
      label: 'Inventory Health',
      value: `${goodBatches.length}/${totalBatches}`,
      change: `${Math.round((goodBatches.length / totalBatches) * 100)}% good`,
      changeType: 'increase',
      icon: AlertTriangle
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.label}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                    <dd className={`text-sm ${
                      stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Batch Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Batch Status Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Good Condition</span>
                <span className="text-sm font-semibold text-green-600">
                  {goodBatches.length} batches
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(goodBatches.length / totalBatches) * 100}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Expiring Soon</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {expiringSoon.length} batches
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${(expiringSoon.length / totalBatches) * 100}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Expired</span>
                <span className="text-sm font-semibold text-red-600">
                  {expiredBatches.length} batches
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${(expiredBatches.length / totalBatches) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Products by Category
            </h3>
            <div className="space-y-3">
              {Object.entries(categoryDistribution).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">{category}</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {count} products
                  </span>
                </div>
              ))}
              {Object.keys(categoryDistribution).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No category data available. Add products to see distribution.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Smart Recommendations
          </h3>
          <div className="space-y-3">
            {expiredBatches.length > 0 && (
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Remove expired items immediately
                  </p>
                  <p className="text-sm text-gray-500">
                    You have {expiredBatches.length} expired batches that should be removed from shelves.
                  </p>
                </div>
              </div>
            )}
            
            {expiringSoon.length > 0 && (
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Create promotions for soon-to-expire items
                  </p>
                  <p className="text-sm text-gray-500">
                    {expiringSoon.length} batches are expiring within 7 days. Consider discounts or bundles.
                  </p>
                </div>
              </div>
            )}

            {goodBatches.length === totalBatches && totalBatches > 0 && (
              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Excellent inventory health
                  </p>
                  <p className="text-sm text-gray-500">
                    All your batches are in good condition. Keep up the great inventory management!
                  </p>
                </div>
              </div>
            )}

            {batches.length === 0 && (
              <div className="flex items-start">
                <Package className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Start tracking your inventory
                  </p>
                  <p className="text-sm text-gray-500">
                    Add products and batches to begin receiving smart recommendations and analytics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics