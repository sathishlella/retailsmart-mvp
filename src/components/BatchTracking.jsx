import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const BatchTracking = ({
  batches,
  setBatches,
  products,
  defaultOpenForm = false,
  onCloseForm,
  // NEW:
  filterMode = null,     // 'expiringSoon' | 'expired' | null
  filterLabel = null,
  onClearFilter = null
}) => {
  const [showForm, setShowForm] = useState(Boolean(defaultOpenForm))
  const [newBatch, setNewBatch] = useState({
    productId: '',
    quantity: 1,
    expiryDate: '',
    location: 'Front Shelf',
  })

  useEffect(() => {
    if (defaultOpenForm) setShowForm(true)
  }, [defaultOpenForm])
  useEffect(() => {
    if (!showForm && defaultOpenForm && onCloseForm) onCloseForm()
  }, [showForm])

  // Prefill expiry date from product shelfLife when selecting a product
  useEffect(() => {
    if (!newBatch.productId) return
    if (newBatch.expiryDate) return
    const prod = products.find(p => String(p.id) === String(newBatch.productId))
    if (!prod) return
    const d = new Date()
    d.setDate(d.getDate() + (Number(prod.shelfLife) || 30))
    setNewBatch(prev => ({ ...prev, expiryDate: d.toISOString().slice(0, 10) }))
  }, [newBatch.productId, products])

  const daysUntil = (date) => {
    const d = new Date(date)
    const now = new Date()
    return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
  }

  const handleAddBatch = (e) => {
    e.preventDefault()
    if (!newBatch.productId || !newBatch.expiryDate) return
    const selected = products.find(p => String(p.id) === String(newBatch.productId))
    if (!selected) return
    const batch = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
      productId: String(selected.id),
      quantity: Number(newBatch.quantity) || 1,
      expiryDate: newBatch.expiryDate,
      location: newBatch.location || 'Front Shelf',
    }
    setBatches([ ...batches, batch ])
    setNewBatch({ productId: '', quantity: 1, expiryDate: '', location: 'Front Shelf' })
    setShowForm(false)
    if (onCloseForm) onCloseForm()
  }

  const handleDeleteBatch = (batchId) => {
    setBatches(batches.filter(b => b.id !== batchId))
  }

  const getBatchStatus = (expiryDate) => {
    const d = daysUntil(expiryDate)
    if (isNaN(d)) return { label: 'Unknown', cls: 'bg-gray-100 text-gray-700' }
    if (d < 0) return { label: 'Expired', cls: 'bg-red-100 text-red-700' }
    if (d <= 7) return { label: 'Expiring soon', cls: 'bg-yellow-100 text-yellow-700' }
    return { label: 'Fresh', cls: 'bg-green-100 text-green-700' }
  }

  const batchesWithProduct = useMemo(() => {
    const byId = new Map(products.map(p => [String(p.id), p]))
    let list = batches.map(b => ({ ...b, product: byId.get(String(b.productId)) }))

    if (filterMode === 'expiringSoon') {
      list = list.filter(b => {
        const d = daysUntil(b.expiryDate)
        return d <= 7 && d > 0
      })
    } else if (filterMode === 'expired') {
      list = list.filter(b => daysUntil(b.expiryDate) < 0)
    }
    return list
  }, [batches, products, filterMode])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Batches</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          disabled={products.length === 0}
          title={products.length === 0 ? 'Add a product first' : ''}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Batch
        </button>
      </div>

      {filterLabel && (
        <div className="p-3 rounded-md border bg-blue-50 border-blue-200 flex items-center justify-between">
          <span className="text-sm text-blue-900">{filterLabel}</span>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="text-sm underline text-blue-700 hover:text-blue-900"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {products.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          Add at least one product before creating batches.
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium">New Batch</h3>
          <form onSubmit={handleAddBatch} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                className="mt-1 w-full rounded-md border-gray-300"
                value={newBatch.productId}
                onChange={e => setNewBatch({ ...newBatch, productId: e.target.value })}
                required
              >
                <option value="">Select…</option>
                {products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                className="mt-1 w-full rounded-md border-gray-300"
                value={newBatch.quantity}
                onChange={e => setNewBatch({ ...newBatch, quantity: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border-gray-300"
                value={newBatch.expiryDate}
                onChange={e => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <select
                className="mt-1 w-full rounded-md border-gray-300"
                value={newBatch.location}
                onChange={e => setNewBatch({ ...newBatch, location: e.target.value })}
              >
                <option>Front Shelf</option>
                <option>Back Shelf</option>
                <option>Cold Storage</option>
                <option>Warehouse</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Save Batch
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow divide-y">
        {batchesWithProduct.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No batches to show.</div>
        ) : (
          batchesWithProduct.map(b => {
            const status = getBatchStatus(b.expiryDate)
            return (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{b.product?.name || 'Unknown product'}</p>
                  <p className="text-sm text-gray-500">
                    Qty {b.quantity} • Expires {b.expiryDate || '—'} • {b.location}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs rounded ${status.cls}`}>
                    {status.label}
                  </span>
                  <button
                    onClick={() => handleDeleteBatch(b.id)}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default BatchTracking
