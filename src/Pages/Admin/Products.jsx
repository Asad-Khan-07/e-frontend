import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/api'
import { useCart, useTheme } from '../../context/context'

const EMPTY = {
  name: '', price: '', originalPrice: '', category: '',
  description: '', image: '', badge: '', sizes: '', colors: '',
  isActive: true, stock: 100
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const { convertToUSD } = useCart()
  const { theme } = useTheme()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [prods, cats] = await Promise.all([getProducts(), getCategories()])
    setProducts(Array.isArray(prods) ? prods : [])
    setCategories(Array.isArray(cats) ? cats : [])
    setLoading(false)
  }

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY)
    setModal(true)
  }

  const openEdit = (p) => {
    setEditing(p._id)
    setForm({
      ...p,
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes,
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors,
    })
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const data = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      stock: Number(form.stock),
      sizes: typeof form.sizes === 'string' ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : form.sizes,
      colors: typeof form.colors === 'string' ? form.colors.split(',').map(s => s.trim()).filter(Boolean) : form.colors,
    }
    if (editing) {
      await updateProduct(editing, data)
    } else {
      await createProduct(data)
    }
    await loadData()
    setModal(false)
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    setProducts(products.filter(p => p._id !== id))
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black">Products</h2>
          <p className="text-white/40 text-sm mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-colors text-sm"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-white/30">Loading...</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4">Stock</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-white/10" />
                      <div className=' text-start'>
                        <p className="font-medium text-sm">{p.name}</p>
                        {p.badge && <span className="text-xs text-amber-400">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm">{p.category}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-amber-400">${convertToUSD(p.price).toFixed(2)}</p>
                    <p className="text-xs text-white/30 line-through">${convertToUSD(p.originalPrice).toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">{p.stock ?? 100}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${p.isActive ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="bg-white/5 hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/20 text-white/60 hover:text-amber-400 px-3 py-1.5 rounded-lg text-xs transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white/60 hover:text-red-400 px-3 py-1.5 rounded-lg text-xs transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30">No products found</div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#111] border-white/10'} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-bold">{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setModal(false)} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Product Name', full: true },
                { key: 'price', label: 'Price ($)', type: 'number' },
                { key: 'originalPrice', label: 'Original Price ($)', type: 'number' },
                { key: 'stock', label: 'Stock', type: 'number' },
                { key: 'image', label: 'Image URL', full: true },
                { key: 'description', label: 'Description', full: true, textarea: true },
                { key: 'sizes', label: 'Sizes (comma separated)', full: true },
                { key: 'colors', label: 'Colors (comma separated)', full: true },
                { key: 'badge', label: 'Badge (optional)' },
              ].map(field => (
                <div key={field.key} className={field.full ? 'col-span-2' : ''}>
                  <label className="text-white/60 text-xs mb-1 block text-start">{field.label}</label>
                  {field.textarea ? (
                    <textarea
                      value={form[field.key] || ''}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={form[field.key] || ''}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
                    />
                  )}
                </div>
              ))}

              {/* Category select */}
              <div>
                <label className="text-white/60 text-xs mb-1 block">Category</label>
                <select
                  value={form.category || ''}
                  onChange={e => setForm({ ...form, category:   e.target.value })}
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1a1a1a] border-white/10 text-white'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400/50 transition-colors`}
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {/* Status toggle */}
              <div>
                <label className="text-white/60 text-xs mb-1 block text-start">Status</label>
                <select
                  value={form.isActive ? 'true' : 'false'}
                  onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1a1a1a] border-white/10 text-white'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400/50 transition-colors`}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/10">
              <button onClick={() => setModal(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold py-2.5 rounded-xl text-sm transition-colors">
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
