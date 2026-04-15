import { useState, useEffect } from 'react'
import { getCategories, createCategory, deleteCategory } from '../../services/api'

const EMPTY = { name: '', slug: '', color: '#f59e0b' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const data = await getCategories()
    setCategories(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!form.name) return
    setSaving(true)
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-')
    await createCategory({ ...form, slug })
    setForm(EMPTY)
    await load()
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    await deleteCategory(id)
    setCategories(categories.filter(c => c._id !== id))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black">Categories</h2>
        <p className="text-white/40 text-sm mt-1">{categories.length} total categories</p>
      </div>

      {/* Add form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h3 className="font-bold mb-4 text-amber-400">Add New Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className='flex items-start flex-col justify-center '>
            <label className="text-white/60 text-xs mb-1 block">Name</label>
            <input
              type="text"
              placeholder="e.g. Electronics"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>
          <div className='flex items-start flex-col justify-center '>
            <label className="text-white/60 text-xs mb-1 block">Slug (auto)</label>
            <input
              type="text"
              placeholder="e.g. electronics"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>
          <div className='flex items-start flex-col justify-center '>
            <label className="text-white/60 text-xs mb-1 block">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={form.color}
                onChange={e => setForm({ ...form, color: e.target.value })}
                className="h-10 w-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={form.color}
                onChange={e => setForm({ ...form, color: e.target.value })}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={saving || !form.name}
          className="mt-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          {saving ? 'Adding...' : '+ Add Category'}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 text-white/30">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20', border: `1px solid ${cat.color}40` }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                </div>
                <div>
                  <p className="font-bold text-sm">{cat.name}</p>
                  <p className="text-white/30 text-xs">{cat.slug}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(cat._id)}
                className="bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white/40 hover:text-red-400 w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
