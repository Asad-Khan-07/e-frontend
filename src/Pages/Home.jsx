import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { products } from '../data/products'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import { useCart } from '../context/context'

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse">
      <div className="h-64 bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-white/10 rounded w-1/3" />
        <div className="h-4 bg-white/10 rounded w-2/3" />
        <div className="h-4 bg-white/10 rounded w-1/4" />
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const { convertToUSD } = useCart()

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all duration-500 hover:-translate-y-1">
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          <span className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
          <div className="absolute bottom-3 left-3 right-3 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm py-2 rounded-xl transition-colors">
              Quick Add
            </button>
          </div>
        </div>
        <div className="p-4 text-start">
          <p className="text-white/40 text-xs mb-1">{product.category}</p>
          <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-amber-400 font-bold">${convertToUSD(product.price).toFixed(2)}</span>
            <span className="text-white/30 text-sm line-through">${convertToUSD(product.originalPrice).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white/40 text-xs">({product.reviews})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const featured = products.slice(4, 8)
  const categories = Object.values(
    products.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = p
      return acc
    }, {})
  ).slice(0, 4)

  return (
    <main>
      <Hero />

      {/* Category Images */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80' },
            { label: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
            { label: 'Accessories', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80' },
            { label: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
          ].map((cat) => (
            <Link
              key={cat.label}
              to="/products"
              className="relative overflow-hidden rounded-2xl hover:scale-105 transition-all duration-300 group block"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-3 left-4 font-bold text-base" style={{ color: '#fff' }}>{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-2">Trending Now</p>
            <h2 className="text-4xl font-black">Featured Products</h2>
          </div>
          <Link to="/products" className="text-white/50 hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : featured.map((product) => <ProductCard key={product.id} product={product} />)
          }
        </div>
      </section>

      {/* Categories Products */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black">Categories</h2>
          </div>
          <Link to="/categories" className="text-white/50 hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : categories.map((product) => <ProductCard key={product.id} product={product} />)
          }
        </div>
      </section>

      {/* Banner */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 p-12 md:p-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-4xl font-black" style={{ color: '#0f172a' }}>Sale Up To 40% Off</h2>
              <p className="text-lg" style={{ color: 'rgba(15,23,42,0.6)' }}>Limited time offer on selected items. Don't miss out!</p>
            </div>
            <Link
              to="/products"
              className="shrink-0 font-bold px-8 py-4 rounded-full transition-colors"
              style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
            >
              Shop Sale
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}