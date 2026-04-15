import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories } from '../services/api'
import { useCart, useTheme } from '../context/context'

function ProductCard({ product }) {
  const { cart, setCart } = useCart()
  const { theme } = useTheme()
  const { convertToUSD } = useCart()
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const addToCart = (e) => {
    e.preventDefault()
    const existing = cart.find(i => i._id === product._id)
    let updated
    if (existing) {
      updated = cart.map(i => i._id === product._id ? { ...i, quantity: (i.quantity || 1) + 1 } : i)
    } else {
      updated = [...cart, { ...product, quantity: 1 }]
    }
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all duration-500 hover:-translate-y-1">
        <div className="relative h-64 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full">{product.badge}</span>
          )}
          <span className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>
          <div className="absolute bottom-3 left-3 right-3 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button onClick={addToCart} className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm py-2 rounded-xl transition-colors">
              Quick Add
            </button>
          </div>
        </div>
        <div className="p-4 text-start">
          <p className="text-white/40 text-xs mb-1">{product.category}</p>
          <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-amber-400 font-bold">${convertToUSD(product.price)}</span>
            <span className="text-white/30 text-sm line-through">${convertToUSD(product.originalPrice)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activeCategory !== 'all') params.category = activeCategory
    if (search) params.search = search
    getProducts(params).then(data => {
      setProducts(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [activeCategory, search])

  const isLight = theme === 'light'

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0a0a] text-white'}`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black">All Products</h1>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400/50 transition-colors text-sm w-full md:w-64 ${isLight ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500' : 'bg-white/5 border border-white/10 text-white placeholder-white/30'}`}
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat.name ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-white/30">No products found</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
