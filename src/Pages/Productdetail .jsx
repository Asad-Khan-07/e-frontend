import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../services/api'
import { useCart } from '../context/context'
import { products as localProducts } from '../data/products'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const { setCart, convertToUSD } = useCart()

  useEffect(() => {
    setLoading(true)

    // Check whether the id is numeric (local data) or a MongoDB _id
    const isNumericId = /^\d+$/.test(id)

    if (isNumericId) {
      // Find product from local data
      const localProduct = localProducts.find(p => String(p.id) === String(id))
      if (localProduct) {
        setProduct({ ...localProduct, _id: localProduct.id })
        if (localProduct.colors && localProduct.colors.length > 0) setSelectedColor(localProduct.colors[0])
      } else {
        setProduct(null)
      }
      setLoading(false)
    } else {
      // It's a MongoDB _id, fetch from API
      getProduct(id)
        .then(data => {
          if (data && data._id) {
            setProduct(data)
            if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0])
          } else {
            setProduct(null)
          }
        })
        .catch(() => setProduct(null))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/40 text-xl">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-xl mb-4">Product not found</p>
          <Link to="/products" className="text-amber-400 hover:underline">← Back to Products</Link>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size first!')
      return
    }
    const cartData = {
      _id: product._id,
      id: product._id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: qty,
      image: product.image,
      category: product.category,
      cartItemId: Date.now(),
    }
    setCart(prev => {
      const updated = [...prev, cartData]
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-2 text-sm text-white/40 mb-10">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-white transition-colors">Products</Link>
        <span>/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden aspect-square bg-white/5 border border-white/10">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              {product.badge && (
                <span className="bg-amber-400 text-black text-sm font-bold px-3 py-1 rounded-full">{product.badge}</span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}% OFF</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-2">{product.category}</p>
          <h1 className="text-4xl font-black mb-4">{product.name}</h1>

          {product.rating && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-bold">{product.rating}</span>
              {product.reviews && <span className="text-white/40 text-sm">({product.reviews} reviews)</span>}
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-white/10">
            <span className="text-5xl font-black text-amber-400">${convertToUSD(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-white/30 text-xl line-through">${convertToUSD(product.originalPrice)}</span>
                <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2 py-1 rounded-lg">
                  Save ${(convertToUSD(product.originalPrice - product.price))}
                </span>
              </>
            )}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-white/60 mb-3">Color</p>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-amber-400 scale-110' : 'border-transparent hover:border-white/50'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-white/60">Size</p>
                <button className="text-amber-400 text-xs hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selectedSize === size ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 border-white/20 text-white/70 hover:border-white/50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <p className="text-sm font-medium text-white/60">Qty:</p>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors text-xl font-bold">−</button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors text-xl font-bold">+</button>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 font-bold py-4 rounded-2xl text-lg transition-all ${added ? 'bg-green-500 text-white scale-95' : 'bg-amber-400 hover:bg-amber-300 text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.3)]'}`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: '🚚', label: 'Free Delivery', sub: 'Over $7.14' },
              { icon: '↩️', label: 'Easy Returns', sub: '30-day policy' },
              { icon: '🔒', label: 'Secure Pay', sub: '100% safe' },
            ].map((perk) => (
              <div key={perk.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-xl mb-1">{perk.icon}</div>
                <p className="text-xs font-bold text-white">{perk.label}</p>
                <p className="text-xs text-white/40">{perk.sub}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex gap-6 mb-4">
              {['description', 'details', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium capitalize pb-2 border-b-2 transition-all ${activeTab === tab ? 'border-amber-400 text-amber-400' : 'border-transparent text-white/40 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="text-white/60 text-sm leading-relaxed">
              {activeTab === 'description' && (product.description || 'No description available.')}
              {activeTab === 'details' && (
                <ul className="space-y-2">
                  <li>• Material: Premium Cotton Blend</li>
                  <li>• Origin: Made in Pakistan</li>
                  <li>• Care: Machine wash cold</li>
                  <li>• Fit: Regular / Relaxed</li>
                </ul>
              )}
              {activeTab === 'reviews' && (
                <p>⭐ {product.rating || 'N/A'}/5 based on {product.reviews || 0} verified reviews.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
