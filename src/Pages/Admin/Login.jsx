import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../services/api'
import { useTheme } from '../../context/context'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const inputClasses = `w-full rounded-xl px-4 py-3 transition-colors focus:outline-none ${isLight ? 'bg-white/90 border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-amber-400/50' : 'bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-amber-400/50'}`

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await adminLogin(form)
      if (res.token) {
        localStorage.setItem('adminToken', res.token)
        localStorage.setItem('adminUser', JSON.stringify(res.admin))
        navigate('/admin')
      } else {
        setError(res.message || 'Invalid credentials')
      }
    } catch {
      setError('Server error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50' : 'bg-[#0a0a0a]'} flex items-center justify-center px-4`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl font-black text-amber-400">LUXE<span className={theme === 'light' ? 'text-slate-900' : 'text-white'}>ADMIN</span></span>
          <p className={`text-white/40 mt-2 text-sm ${theme === 'light' ? 'text-slate-500' : ''}`}>Admin Panel Login</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="space-y-4">
            <div>
              <label className={`${isLight ? 'text-slate-700' : 'text-white/60'} text-sm mb-1 block text-start`}>Email</label>
              <input
                type="email"
                placeholder="admin@store.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={`${isLight ? 'text-slate-700' : 'text-white/60'} text-sm mb-1 block text-start`}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className={inputClasses}
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
