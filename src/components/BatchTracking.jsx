import React, { useState } from 'react'
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'

const BatchTracking = ({ batches, setBatches, products }) => {
  const [showForm, setShowForm] = useState(false)
  const [newBatch, setNewBatch] = useState({
    productId: '',
    quantity: 1,
    expiryDate: '',
    location: 'Front Shelf'
  })

  const handleAddBatch = (e) => {
    e.preventDefault()
    const selectedProduct = products.find(p => p.id === newBatch.productId)
    const batch = {
      id: Date.now().toString(),
      ...newBatch,
      productName: selectedProduct?.name || 'Unknown Product',
      category: selectedProduct?.category || 'Unknown',
      createdAt: new Date().toISOString()
    }
    setBatches([...batches, batch])
    setNewBatch({ productId: '', quantity: 1, expiryDate: '', location: 'Front Shelf' })
    setShowForm(false)
  }

  const handleDeleteBatch = (batchId) => {
    setBatches(batches.filter(batch => batch.id !== batchId))
  }

  const getBatchStatus = (expiryDate) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'red', text: 'Expired' }
    if (daysUntilExpiry <= 3) return { status: 'urgent', color: 'red', text: 'Urgent' }
    if (daysUntilExpiry <= 7) return { status: 'warning', color: 'yellow', text: 'Expiring Soon' }
    return { status: 'good', color: 'green', text: 'Good' }
  }

  const expiredBatches = batches.filter(batch => getBatchStatus(batch.expiryDate).status === 'expired')
  const urgentBatches = batches.filter(batch => getBatchStatus(batch.expiryDate).status === 'urgent')
  const warningBatches = batches.filter(batch => getBatchStatus(batch.expiryDate).status === 'warning')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Batch Tracking</h2>
        <button
          onClick={() => setShowForm(true)}
          disabled={products.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Batch
        </button>
      </div>

      {products.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">
              Please add products first before creating batches.
            </p>
          </div>
        </div>
      )}

      {/* Priority Alerts */}
      {(expiredBatches.length > 0 || urgentBatches.length > 0) && (
        <div className="space-y-3">
          {expiredBatches.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm font-medium text-red-800">
                  {expiredBatches.length} expired batches need immediate attention
                </span>
              </div>
            </div>
          )}
          {urgentBatches.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
                <span className="text-sm font-medium text-orange-800">
                  {urgentBatches.length} batches expiring within 3 days
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Batch Form */}
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Batch</h3>
          <form onSubmit={handleAddBatch} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  required
                  value={newBatch.productId}
                  onChange={(e) => setNewBatch({ ...newBatch, productId: e.target.value })}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.category})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newBatch.quantity}
                  onChange={(e) => setNewBatch({ ...newProduct, quantity: parseInt(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={newBatch.expiryDate}
                  onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <select
                  value={newBatch.location}
                  onChange={(e) => setNewBatch({ ...newBatch, location: e.target.value })}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Front Shelf">Front Shelf</option>
                  <option value="Middle Shelf">Middle Shelf</option>
                  <option value="Back Shelf">Back Shelf</option>
                  <option value="Storage Room">Storage Room</option>
                  <option value="Cold Room">Cold Room</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Batch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Batches List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {batches.map((batch) => {
            const status = getBatchStatus(batch.expiryDate)
            return (
              <li key={batch.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {status.status === 'good' ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <AlertTriangle className={`h-8 w-8 text-${status.color}-500`} />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {batch.productName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Quantity: {batch.quantity} • Location: {batch.location}
                      </div>
                      <div className="text-sm text-gray-500">
                        Expires: {new Date(batch.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                      {status.text}
                    </span>
                    <button
                      onClick={() => handleDeleteBatch(batch.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        
        {batches.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No batches</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start tracking your inventory by adding your first batch.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BatchTracking