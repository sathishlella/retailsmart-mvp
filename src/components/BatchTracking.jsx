import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const BatchTracking = ({ batches, setBatches, products, defaultOpenForm = false, onCloseForm }) => {
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
    const exp = new Date(expiryDate)
    const now = new Date()
    const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))
    if (isNaN(days)) return { label: 'Unknown', cls: 'bg-gray-100 text-gray-700' }
    if (days < 0) return { label: 'Expired', cls: 'bg-red-100 text-red-700' }
    if (days <= 7) return { label: 'Expiring soon', cls: 'bg-yellow-100 text-yellow-700' }
    return { label: 'Fresh', cls: 'bg-green-100 text-green-700' }
  }

  const batchesWithProduct = useMemo(() => {
    const byId = new Map(products.map(p => [String(p.id), p]))
    return batches.map(b => ({ ...b, product: byId.get(String(b.productId)) }))
  }, [batches, products])

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
