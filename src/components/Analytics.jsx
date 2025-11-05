import React from 'react'
import { TrendingUp, Package, AlertTriangle } from 'lucide-react'

const Analytics = ({ products, batches }) => {
  const daysUntil = (date) => {
    const d = new Date(date)
    const now = new Date()
    return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
  }

  const expiredBatches = batches.filter(b => daysUntil(b.expiryDate) < 0)
  const expiringSoonBatches = batches.filter(b => {
    const d = daysUntil(b.expiryDate)
    return d <= 7 && d > 0
  })

  const expiringSoonProductIds = new Set(expiringSoonBatches.map(b => String(b.productId)))
  const expiredProductIds = new Set(expiredBatches.map(b => String(b.productId)))

  const cards = [
    { label: 'Total Products', value: products.length, icon: Package, cls: 'text-blue-600' },
    { label: 'Total Batches', value: batches.length, icon: TrendingUp, cls: 'text-indigo-600' },
    { label: 'Batches Expiring Soon', value: expiringSoonBatches.length, icon: AlertTriangle, cls: 'text-yellow-600' },
    { label: 'Expired Batches', value: expiredBatches.length, icon: AlertTriangle, cls: 'text-red-600' },
    { label: 'Products at Risk (Soon)', value: expiringSoonProductIds.size, icon: AlertTriangle, cls: 'text-yellow-700' },
    { label: 'Products with Expired Items', value: expiredProductIds.size, icon: AlertTriangle, cls: 'text-red-700' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 ${s.cls}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500 truncate">{s.label}</div>
                    <div className="text-lg font-semibold text-gray-900">{s.value}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {products.length === 0 && batches.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-700 font-medium">No data yet.</p>
            <p className="text-gray-500 text-sm">Add products and batches to see insights.</p>
          </div>
        ) : (
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><strong>{expiringSoonBatches.length}</strong> batches are expiring within a week across <strong>{expiringSoonProductIds.size}</strong> products.</li>
            <li><strong>{expiredBatches.length}</strong> batches have already expired across <strong>{expiredProductIds.size}</strong> products.</li>
            <li>Average batches per product: <strong>{products.length === 0 ? 0 : (batches.length / products.length).toFixed(1)}</strong>.</li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default Analytics
