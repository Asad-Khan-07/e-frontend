import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userLogin, userRegister } from '../services/api'
import { useTheme } from '../context/context'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { theme } = useTheme()

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = isLogin
        ? await userLogin({ email: form.email, password: form.password })
        : await userRegister(form)

      if (res.token) {
        localStorage.setItem('userToken', res.token)
        localStorage.setItem('user', JSON.stringify(res.user))
        navigate('/')
        window.location.reload()
      } else {
        setError(res.message || 'Something went wrong')
      }
    } catch {
      setError('Server error. Please try again.')
    }
    setLoading(false)
  }

  const isLight = theme === 'light'

  const inputClass = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
    isLight
      ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-400'
      : 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-amber-400/50'
  }`

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isLight ? 'bg-slate-50' : 'bg-[#0a0a0a]'}`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-amber-400">
            LUXE<span className={isLight ? 'text-slate-900' : 'text-white'}>STORE</span>
          </Link>
          <p className={`mt-2 text-sm ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div className={`border rounded-2xl p-8 ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
          {/* Tabs */}
          <div className={`flex rounded-xl p-1 mb-6 ${isLight ? 'bg-slate-100' : 'bg-white/5'}`}>
            <button
              onClick={() => { setIsLogin(true); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-amber-400 text-black' : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-white/50 hover:text-white'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-amber-400 text-black' : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-white/50 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className={`text-sm mb-1 block text-start ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}
            <div>
              <label className={`text-sm mb-1 block text-start ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`text-sm mb-1 block text-start ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}