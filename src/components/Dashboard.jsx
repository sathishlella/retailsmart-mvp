import React from 'react'
import { AlertTriangle, Package, TrendingUp, DollarSign } from 'lucide-react'

const Dashboard = ({ products, batches }) => {
  const expiringSoon = batches.filter(batch => {
    const expiryDate = new Date(batch.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  })

  const expiredBatches = batches.filter(batch => {
    const expiryDate = new Date(batch.expiryDate)
    return expiryDate < new Date()
  })

  const totalProducts = products.length
  const totalBatches = batches.length

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'blue'
    },
    {
      label: 'Active Batches',
      value: totalBatches,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Expiring Soon',
      value: expiringSoon.length,
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      label: 'Expired Items',
      value: expiredBatches.length,
      icon: DollarSign,
      color: 'red'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.label}
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alerts Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Priority Alerts
          </h3>
          
          {expiredBatches.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    {expiredBatches.length} expired items
                  </h4>
                  <p className="text-sm text-red-600 mt-1">
                    These products have passed their expiry date and should be removed from shelves.
                  </p>
                </div>
              </div>
            </div>
          )}

          {expiringSoon.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    {expiringSoon.length} items expiring soon
                  </h4>
                  <p className="text-sm text-yellow-600 mt-1">
                    Consider creating promotions or moving these to the front of shelves.
                  </p>
                </div>
              </div>
            </div>
          )}

          {expiredBatches.length === 0 && expiringSoon.length === 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <Package className="h-5 w-5 text-green-400 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    All products are in good condition
                  </h4>
                  <p className="text-sm text-green-600 mt-1">
                    No expired or soon-to-expire items found. Great job managing your inventory!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Package className="h-4 w-4 mr-2" />
              Add New Product
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard