import React from 'react'
import { AlertTriangle, Package, TrendingUp, DollarSign, Plus } from 'lucide-react'

const Dashboard = ({ products, batches, onAddProduct, onAddBatch, onViewAnalytics }) => {
  const expiringSoon = batches.filter(b => {
    const expiryDate = new Date(b.expiryDate)
    const today = new Date()
    const days = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
    return days <= 7 && days > 0
  })

  const expiredBatches = batches.filter(b => new Date(b.expiryDate) < new Date())

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'blue' },
    { label: 'Total Batches', value: batches.length, icon: TrendingUp, color: 'indigo' },
    { label: 'Expiring Soon', value: expiringSoon.length, icon: AlertTriangle, color: 'yellow' },
    { label: 'Expired', value: expiredBatches.length, icon: DollarSign, color: 'red' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={onAddProduct}
            className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Product
          </button>
          <button
            onClick={onAddBatch}
            className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Batch
          </button>
          <button
            onClick={onViewAnalytics}
            className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
          >
            View Analytics
          </button>
        </div>
      </div>

      {/* Notices */}
      {(expiringSoon.length > 0 || expiredBatches.length > 0) ? (
        <div className="space-y-3">
          {expiringSoon.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="ml-3">
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
          {expiredBatches.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">
                    {expiredBatches.length} items expired
                  </h4>
                  <p className="text-sm text-red-600 mt-1">
                    Remove or write-off these items to keep inventory accurate.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <Package className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">All good!</h4>
              <p className="text-sm text-green-700 mt-1">
                No expiring or expired inventory detected.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
