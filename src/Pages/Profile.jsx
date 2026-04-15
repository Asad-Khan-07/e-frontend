import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getMyOrders, cancelOrder } from '../services/api'
import { useCart } from '../context/context'

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/20',
}

// Cancellation is only allowed for these statuses
const cancellableStatuses = ['pending', 'processing']

export default function ProfilePage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [cancelError, setCancelError] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const { convertToUSD } = useCart()

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    getMyOrders().then(data => {
      setOrders(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  const logout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('user')
    navigate('/')
    window.location.reload()
  }

  const handleCancelClick = (orderId) => {
    setCancelError('')
    setConfirmId(orderId)
  }

  const handleConfirmCancel = async () => {
    const orderId = confirmId
    setConfirmId(null)
    setCancellingId(orderId)
    setCancelError('')
    try {
      const result = await cancelOrder(orderId)
      if (result && (result.status === 'cancelled' || result._id)) {
        // Update local state — no need to call the API again
        setOrders(prev =>
          prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o)
        )
      } else {
        setCancelError(result?.message || 'Order could not be cancelled. Please try again.')
      }
    } catch {
      setCancelError('Network error. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black">My Account</h1>
            <p className="text-white/40 mt-1">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white/60 hover:text-red-400 px-4 py-2 rounded-xl text-sm transition-all"
          >
            Logout
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-2xl font-black text-amber-400">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-white/40 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-xl font-bold mb-4">My Orders</h2>

        {/* Global cancel error */}
        {cancelError && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
            <p className="text-red-400 text-sm">{cancelError}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-white/30">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-white/30 mb-4">No orders yet</p>
            <Link to="/products" className="bg-amber-400 text-black font-bold px-6 py-2 rounded-xl hover:bg-amber-300 transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/40 text-xs mb-1">Order ID</p>
                    <p className="font-mono text-sm text-amber-400">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColors[order.status] || statusColors.pending}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.name} <span className="text-white/30">x{item.quantity}</span></span>
                      <span className="text-white">${(convertToUSD(item.price * item.quantity)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <p className="text-white/40 text-xs">{new Date(order.createdAt).toLocaleDateString('en-PK')}</p>
                  <p className="font-bold text-amber-400">Total: ${convertToUSD(order.totalAmount).toFixed(2)}</p>
                </div>

                {/* Cancel Button — sirf pending/processing orders ke liye */}
                {cancellableStatuses.includes(order.status) && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {confirmId === order._id ? (
                      // Confirmation prompt
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-white/80 text-sm mb-3 text-center">
                          Are you sure you want to cancel this order?
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setConfirmId(null)}
                            className="flex-1 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white text-sm font-medium transition-colors"
                          >
                            No, go back
                          </button>
                          <button
                            onClick={handleConfirmCancel}
                            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-colors"
                          >
                            Yes, cancel it
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCancelClick(order._id)}
                        disabled={cancellingId === order._id}
                        className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                )}

                {/* Already cancelled message */}
                {order.status === 'cancelled' && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-center text-red-400/60 text-xs">This order has been cancelled</p>
                  </div>
                )}

                {/* Shipped/Delivered — cancel nahi ho sakta */}
                {['shipped', 'delivered'].includes(order.status) && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-center text-white/20 text-xs">
                      {order.status === 'shipped' ? 'Order has shipped — cancellation not possible' : 'Order has been delivered'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
