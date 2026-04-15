import { Link, useNavigate } from 'react-router-dom'
import { useCart, useTheme } from '../context/context'
import { MoonStar, Sun } from 'lucide-react'
export default function Navbar() {
  const { cartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const navBg = theme === 'dark' ? 'bg-[#0a0a0a]/80 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
  const linkText = theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:text-slate-900'

  return (
    <nav className={`sticky top-0 z-50 ${navBg} backdrop-blur-xl`}> 
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-amber-400">
          LUXE<span className="text-white">STORE</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`${linkText} text-sm font-medium transition-colors`}>Home</Link>
          <Link to="/products" className={`${linkText} text-sm font-medium transition-colors`}>Products</Link>
          <Link to="/categories" className={`${linkText} text-sm font-medium transition-colors`}>Categories</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`h-10 w-10 rounded-xl border px-2 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <MoonStar size={20}/>}
          </button>

          {/* Cart */}
          <Link to="/checkout" className={`relative ${theme === 'dark' ? 'bg-white/5 border border-white/10 hover:border-amber-400/30' : 'bg-slate-100 border border-slate-200 hover:border-amber-400/30'} w-10 h-10 rounded-xl flex items-center justify-center transition-all`}>
            <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <Link
              to="/profile"
              className={`bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 px-4 h-10 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`}
            >
              <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-black">
                {user.name?.charAt(0).toUpperCase()}
              </span>
              {user.name?.split(' ')[0]}
            </Link>
          ) : (
            <Link
              to="/auth"
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 h-10 rounded-xl flex items-center text-sm transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
