import React from 'react'
import { TrendingUp, Package, AlertTriangle } from 'lucide-react'

const Analytics = ({ products, batches }) => {
  const totalProducts = products.length
  const totalBatches = batches.length

  const expiredBatches = batches.filter(b => new Date(b.expiryDate) < new Date())
  const expiringSoon = batches.filter(b => {
    const d = new Date(b.expiryDate)
    const days = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
    return days <= 7 && days > 0
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Products', value: totalProducts, icon: Package, color: 'blue' },
          { label: 'Total Batches', value: totalBatches, icon: TrendingUp, color: 'indigo' },
          { label: 'Expiring Soon', value: expiringSoon.length, icon: AlertTriangle, color: 'yellow' },
          { label: 'Expired', value: expiredBatches.length, icon: AlertTriangle, color: 'red' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 text-${s.color}-600`} />
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
        {totalProducts === 0 && totalBatches === 0 ? (
          <div className="text-center">
            <p className="text-gray-700 font-medium">No data yet.</p>
            <p className="text-gray-500 text-sm">Add products and batches to see insights.</p>
          </div>
        ) : (
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Keep an eye on <strong>{expiringSoon.length}</strong> batches that will expire within a week.</li>
            <li><strong>{expiredBatches.length}</strong> batches have expired; consider removing them from shelves.</li>
            <li>Average batches per product: <strong>{totalProducts === 0 ? 0 : (totalBatches / totalProducts).toFixed(1)}</strong>.</li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default Analytics
