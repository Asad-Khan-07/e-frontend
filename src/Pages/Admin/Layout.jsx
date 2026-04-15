import { useState, useEffect } from 'react'
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom'
import { getStats } from '../../services/api'
import { useTheme } from '../../context/context'

const navItems = [
  {
    path: '/admin', label: 'Dashboard', exact: true,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
  },
  {
    path: '/admin/products', label: 'Products',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  },
  {
    path: '/admin/categories', label: 'Categories',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
  },
  {
    path: '/admin/orders', label: 'Orders',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
  },
]

const statConfigs = [
  {
    label: 'Total Products', key: 'totalProducts',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    color: 'text-amber-400', bg: 'bg-amber-400/10'
  },
  {
    label: 'Total Orders', key: 'totalOrders',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    color: 'text-blue-400', bg: 'bg-blue-400/10'
  },
  {
    label: 'Pending Orders', key: 'pendingOrders',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'text-yellow-400', bg: 'bg-yellow-400/10'
  },
  {
    label: 'Revenue', key: 'revenue', isRevenue: true,
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'text-green-400', bg: 'bg-green-400/10'
  },
]

export default function AdminLayout() {
  const [stats, setStats] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const admin = JSON.parse(localStorage.getItem('adminUser') || 'null')

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) { navigate('/admin/login'); return }
    getStats().then(data => setStats(data))
  }, [])

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0a0a] text-white'} flex`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#111] border-white/10'} border-r flex flex-col transition-all duration-300 fixed h-full z-20`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && <span className="text-lg font-black text-amber-400">LUXE<span className="text-white">ADMIN</span></span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white transition-colors ml-auto">
            {sidebarOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive(item.path, item.exact)
                  ? 'bg-amber-400/20 text-amber-400 border border-amber-400/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              {sidebarOpen && item.path === '/admin/orders' && stats?.pendingOrders > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingOrders}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Admin info */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0  text-start">
                <p className="text-sm font-medium truncate">{admin?.name || 'Admin'}</p>
                <button onClick={logout} className="text-xs text-white/30 hover:text-red-400 transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Top bar */}
        <div className={`sticky top-0 z-10 ${theme === 'light' ? 'bg-slate-50/80 border-slate-200' : 'bg-[#0a0a0a]/80 border-white/10'} backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between`}>
          <h1 className="font-bold">
            {navItems.find(n => isActive(n.path, n.exact))?.label || 'Admin Panel'}
          </h1>
          {stats && (
            <div className={`flex items-center gap-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-white/40'}`}>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                {stats.totalProducts} products
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {stats.totalOrders} orders
              </span>
            </div>
          )}
        </div>

        {/* Stats cards - only on dashboard */}
        {location.pathname === '/admin' && stats && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statConfigs.map(stat => (
                <div key={stat.label} className={`${theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'} rounded-2xl p-5`}>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                    {stat.icon}
                  </div>
                  <div className={`text-2xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'} text-start`}>
                    {stat.isRevenue ? `Rs ${(stats.revenue || 0).toLocaleString()}` : stats[stat.key]}
                  </div>
                  <div className={`${theme === 'light' ? 'text-slate-500' : 'text-white/40'} text-sm mt-1 text-start`}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className={`${theme === 'light' ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-white/30'} rounded-2xl p-8 text-center`}>
              <svg className={`w-12 h-12 mx-auto mb-3 ${theme === 'light' ? 'text-slate-300' : 'text-white/10'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
              <p className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-white/60'}`}>Welcome to Admin Panel</p>
              <p>Use the sidebar to manage your store</p>
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  )
}