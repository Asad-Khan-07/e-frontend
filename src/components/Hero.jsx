import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/context'

function Hero() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-slate-950'} `}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt="Hero"
          className={`w-full h-full object-cover ${isLight ? 'opacity-60 brightness-90' : 'opacity-30 brightness-75'}`}
        />
        <div
          className={`absolute inset-0 ${isLight ? 'bg-gradient-to-r from-white/90 via-white/70 to-transparent' : 'bg-gradient-to-r from-black via-black/80 to-transparent'}`}
        />
        <div
          className={`absolute inset-0 ${isLight ? 'bg-gradient-to-t from-white/80 via-transparent to-transparent' : 'bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent'}`}
        />
      </div>

      {/* Decorative Orb */}
      <div className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none ${isLight ? 'bg-amber-300/20' : 'bg-amber-400/10'}`} />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 ${isLight ? 'bg-amber-400/10 border border-amber-300/40' : 'bg-amber-400/10 border border-amber-400/30'}`}>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-sm font-medium">New Collection 2025</span>
          </div>

          <h1 className={`text-6xl md:text-7xl font-black leading-none mb-6 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            DRESS YOUR
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              AMBITION
            </span>
          </h1>

          <p className={`text-lg mb-10 leading-relaxed max-w-lg ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
            Premium streetwear and lifestyle products curated for those who refuse to blend in. Quality that speaks before you do.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center mt-10">
            <Link
              to="/products"
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
            >
              Shop Now
            </Link>
            <Link
              to="/products"
              className={`px-8 py-4 rounded-full font-bold transition-all hover:scale-105 ${isLight ? 'border border-slate-300 text-slate-950 hover:border-slate-400 hover:bg-slate-100' : 'border border-white/20 text-white hover:border-white/50 hover:bg-white/5'}`}
            >
              View Collections
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-6 mt-16 items-center justify-center">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '200+', label: 'Products' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-2xl font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>{stat.value}</p>
                <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-white/40'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
