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
  }, [showForm])

  const categories = [
    'Dairy','Beverages','Bakery','Produce','Snacks','Frozen',
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
    <div classNam
