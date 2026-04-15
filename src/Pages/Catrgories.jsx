import { Link } from 'react-router-dom'
import { products } from '../data/products'
import Footer from '../components/Footer'
import { useCart } from '../context/context'

const allCategories = Object.values(
  products.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = p
    }
    return acc
  }, {})
)

const categoryStyles = {
  Clothing:    { color: 'from-blue-500/20 to-blue-600/20',     border: 'border-blue-500/20',    badge: 'bg-blue-500/20 text-blue-300' },
  Footwear:    { color: 'from-green-500/20 to-green-600/20',   border: 'border-green-500/20',   badge: 'bg-green-500/20 text-green-300' },
  Accessories: { color: 'from-amber-500/20 to-amber-600/20',   border: 'border-amber-500/20',   badge: 'bg-amber-500/20 text-amber-300' },
  Bags:        { color: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/20',  badge: 'bg-purple-500/20 text-purple-300' },
  Sportswear:  { color: 'from-red-500/20 to-red-600/20',       border: 'border-red-500/20',     badge: 'bg-red-500/20 text-red-300' },
  Grooming:    { color: 'from-teal-500/20 to-teal-600/20',     border: 'border-teal-500/20',    badge: 'bg-teal-500/20 text-teal-300' },
  Tech:        { color: 'from-cyan-500/20 to-cyan-600/20',     border: 'border-cyan-500/20',    badge: 'bg-cyan-500/20 text-cyan-300' },
  Fragrance:   { color: 'from-pink-500/20 to-pink-600/20',     border: 'border-pink-500/20',    badge: 'bg-pink-500/20 text-pink-300' },
}

export default function Categories() {
  const { convertToUSD } = useCart()
  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6 text-center">
        <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-3">
          Browse by Category
        </p>
        <h1 className="text-5xl font-black mb-4">All Categories</h1>
        <p className="text-white/40 text-lg max-w-xl mx-auto">
          Explore our full range — from streetwear to tech, grooming to footwear.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allCategories.map((product) => {
            const style = categoryStyles[product.category] || {
              color: 'from-white/5 to-white/10',
              border: 'border-white/10',
              badge: 'bg-white/10 text-white/60',
            }
            const count = products.filter(p => p.category === product.category).length
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

            return (
              <Link
                key={product.category}
                to={`/products?category=${product.category}`}
                className="group block"
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.color} border ${style.border} hover:scale-[1.02] transition-all duration-300`}>

                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.category}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Product count badge */}
                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${style.badge}`}>
                      {count} items
                    </span>

                    {/* Discount */}
                    <span className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors mb-1">
                      {product.category}
                    </h3>
                    <p className="text-white/40 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/30 text-xs mb-0.5">Starting from</p>
                        <p className="text-amber-400 font-black">
                          ${convertToUSD(Math.min(...products.filter(p => p.category === product.category).map(p => p.price))).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-white/10 hover:bg-amber-400 hover:text-black transition-all rounded-full px-4 py-2 text-sm font-bold text-white">
                        Shop Now
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
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