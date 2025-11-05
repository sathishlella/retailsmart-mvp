import React from 'react'
import { AlertTriangle, Package, TrendingUp, DollarSign, Plus, RotateCcw } from 'lucide-react'

const Dashboard = ({ products, batches, onAddProduct, onAddBatch, onViewAnalytics, onResetDemoData }) => {
  const daysUntil = (date) => {
    const d = new Date(date)
    const now = new Date()
    return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
  }

  // Batch-level
  const expiringSoonBatches = batches.filter(b => {
    const d = daysUntil(b.expiryDate)
    return d <= 7 && d > 0
  })
  const expiredBatches = batches.filter(b => daysUntil(b.expiryDate) < 0)

  // Product-level risk
  const expiringSoonProductIds = new Set(expiringSoonBatches.map(b => String(b.productId)))
  const expiredProductIds = new Set(expiredBatches.map(b => String(b.productId)))

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, cls: 'text-blue-600' },
    { label: 'Total Batches', value: batches.length, icon: TrendingUp, cls: 'text-indigo-600' },
    { label: 'Batches Expiring Soon', value: expiringSoonBatches.length, icon: AlertTriangle, cls: 'text-yellow-600' },
    { label: 'Expired Batches', value: expiredBatches.length, icon: DollarSign, cls: 'text-red-600' },
    { label: 'Products at Risk (Soon)', value: expiringSoonProductIds.size, icon: AlertTriangle, cls: 'text-yellow-700' },
    { label: 'Products with Expired Items', value: expiredProductIds.size, icon: AlertTriangle, cls: 'text-red-700' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 ${stat.cls}`} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={onAddProduct} className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
            <Plus className="h-4 w-4 mr-2" /> Add New Product
          </button>
          <button onClick={onAddBatch} className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
            <Plus className="h-4 w-4 mr-2" /> Add Batch
          </button>
          <button onClick={onViewAnalytics} className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
            View Analytics
          </button>
          <button
            onClick={onResetDemoData}
            className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
            title="Replace current data with fresh demo data"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Reset Demo Data
          </button>
        </div>
      </div>

      {/* Notices */}
      {(expiringSoonBatches.length > 0 || expiredBatches.length > 0) ? (
        <div className="space-y-3">
          {expiringSoonBatches.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">
                    {expiringSoonBatches.length} batches expiring soon • {expiringSoonProductIds.size} products affected
                  </h4>
                  <p className="text-sm text-yellow-600 mt-1">
                    Consider promotions or moving these to the front of shelves.
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
                    {expiredBatches.length} batches expired • {expiredProductIds.size} products affected
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
              <p className="text-sm text-green-700 mt-1">No expiring or expired inventory detected.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
