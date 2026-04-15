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

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50' : 'bg-[#0a0a0a]'} flex items-center justify-center px-4`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-amber-400">LUXE<span className={theme === 'light' ? 'text-slate-900' : 'text-white'}>STORE</span></Link>
          <p className={`text-white/40 mt-2 text-sm ${theme === 'light' ? 'text-slate-500' : ''}`}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-amber-400 text-black' : 'text-white/50 hover:text-white'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-amber-400 text-black' : 'text-white/50 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-white/60 text-sm mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
                />
              </div>
            )}
            <div>
              <label className="text-white/60 text-sm mb-1 block">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
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
