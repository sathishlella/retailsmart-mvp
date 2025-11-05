import React from 'react'
import { AlertTriangle, Package, TrendingUp, DollarSign, Plus } from 'lucide-react'

const Dashboard = ({ products, batches, onAddProduct, onAddBatch, onViewAnalytics }) => {
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

  // Product-level: treat a product "at risk" if ANY of its batches are expiring soon / expired
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
