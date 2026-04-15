import { useState, useEffect } from 'react'
import { getAllOrders, updateOrder } from '../../services/api'
import { useCart, useTheme } from '../../context/context'

const statusColors = {
  pending:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  shipped:    'bg-purple-500/20 text-purple-400 border-purple-500/20',
  delivered:  'bg-green-500/20 text-green-400 border-green-500/20',
  cancelled:  'bg-red-500/20 text-red-400 border-red-500/20',
}

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const { convertToUSD } = useCart()
  const { theme } = useTheme()

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const data = await getAllOrders()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleStatusChange = async (id, status) => {
    await updateOrder(id, { status })
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o))
    if (selected?._id === id) setSelected({ ...selected, status })
  }

  const handlePaymentToggle = async (id, current) => {
    const paymentStatus = current === 'paid' ? 'unpaid' : 'paid'
    await updateOrder(id, { paymentStatus })
    setOrders(orders.map(o => o._id === id ? { ...o, paymentStatus } : o))
    if (selected?._id === id) setSelected({ ...selected, paymentStatus })
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black">Orders</h2>
          <p className="text-white/40 text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', ...statuses].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              filter === s ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
            }`}
          >
            {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30">Loading...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div
              key={order._id}
              className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 cursor-pointer transition-all"
              onClick={() => setSelected(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className='text-start'>
                    <p className="font-mono text-amber-400 text-sm font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-white/60 text-sm mt-0.5">{order.customerName} · {order.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                    {order.paymentStatus === 'paid' ? '✓ Paid' : '✗ Unpaid'}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-amber-400 font-bold text-sm">${convertToUSD(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <p className="text-white/30 text-xs">{order.items?.length} items · {order.city}</p>
                <p className="text-white/30 text-xs">{new Date(order.createdAt).toLocaleDateString('en-PK')}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30">No orders found</div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#111] border-white/10'} rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="font-bold">Order Detail</h3>
                <p className="text-amber-400 text-sm font-mono">#{selected._id.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Customer info */}
              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Customer</p>
                <p className="text-sm"><span className="text-white/40">Name: </span>{selected.customerName}</p>
                <p className="text-sm"><span className="text-white/40">Email: </span>{selected.customerEmail}</p>
                <p className="text-sm"><span className="text-white/40">Phone: </span>{selected.customerPhone}</p>
                <p className="text-sm"><span className="text-white/40">Address: </span>{selected.address}, {selected.city}</p>
              </div>

              {/* Items */}
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.name} <span className="text-white/30">x{item.quantity}</span> {item.size && <span className="text-white/20">· {item.size}</span>}</span>
                      <span>Rs {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-amber-400">Rs {selected.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Status update */}
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Update Status</p>
                <div className="grid grid-cols-3 gap-2">
                  {statuses.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected._id, s)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        selected.status === s ? statusColors[s] : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePaymentToggle(selected._id, selected.paymentStatus)}
                  className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                    selected.paymentStatus === 'paid'
                      ? 'bg-green-500/20 border-green-500/20 text-green-400'
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                  }`}
                >
                  {selected.paymentStatus === 'paid' ? '✓ Mark as Unpaid' : 'Mark as Paid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
