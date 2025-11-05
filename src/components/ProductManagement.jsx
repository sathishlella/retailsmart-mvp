import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Search, Package, X } from 'lucide-react'

const ProductManagement = ({ products, setProducts, defaultOpenForm = false, onCloseForm }) => {
  const [showForm, setShowForm] = useState(Boolean(defaultOpenForm))
  const [searchTerm, setSearchTerm] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    barcode: '',
    category: '',
    shelfLife: 30,
  })

  useEffect(() => {
    if (defaultOpenForm) setShowForm(true)
  }, [defaultOpenForm])
  useEffect(() => {
    if (!showForm && defaultOpenForm && onCloseForm) onCloseForm()
  }, [showForm, defaultOpenForm, onCloseForm])

  const categories = [
    'Dairy','Beverages','Liquor','Bakery','Produce','Snacks','Frozen',
    'Meat','Seafood','Pantry','Household','Personal Care'
  ]

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return products
    return products.filter(p =>
      [p.name, p.barcode, p.category].some(val => String(val || '').toLowerCase().includes(q))
    )
  }, [products, searchTerm])

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!newProduct.name.trim()) return
    const product = {
      id: String(Date.now()),
      ...newProduct,
      shelfLife: Number(newProduct.shelfLife) || 30,
    }
    setProducts([ ...products, product ])
    setNewProduct({ name: '', barcode: '', category: '', shelfLife: 30 })
    setShowForm(false)
    if (onCloseForm) onCloseForm()
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Products</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">New Product</h3>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => setShowForm(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAddProduct} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                className="mt-1 w-full rounded-md border-gray-300"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Barcode</label>
              <input
                className="mt-1 w-full rounded-md border-gray-300"
                value={newProduct.barcode}
                onChange={e => setNewProduct({ ...newProduct, barcode: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="mt-1 w-full rounded-md border-gray-300"
                value={newProduct.category}
                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="">Select…</option>
                {categories.map(c => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shelf life (days)</label>
              <input
                type="number"
                min="1"
                className="mt-1 w-full rounded-md border-gray-300"
                value={newProduct.shelfLife}
                onChange={e => setNewProduct({ ...newProduct, shelfLife: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center">
          <Search className="h-4 w-4 mr-2 text-gray-500" />
          <input
            placeholder="Search by name, barcode, or category"
            className="flex-1 focus:outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {filteredProducts.map((p) => (
              <li key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    {p.category || 'Uncategorized'} • {p.barcode || 'No barcode'} • Shelf life {p.shelfLife}d
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ProductManagement
