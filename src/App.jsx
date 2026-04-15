import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './Pages/Home'
import Products from './Pages/Products'
import ProductDetail from './Pages/Productdetail '
import Checkout from './Pages/Checkout'
import Categories from './Pages/Catrgories'
import Auth from './Pages/Auth'
import Profile from './Pages/Profile'
import AdminLogin from './Pages/Admin/Login'
import AdminLayout from './Pages/Admin/Layout'
import AdminProducts from './Pages/Admin/Products'
import AdminCategories from './Pages/Admin/Categories'
import AdminOrders from './Pages/Admin/Orders'
import { useTheme } from './context/context.jsx'

function App() {
  const { theme } = useTheme()
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  const appClasses = theme === 'dark' ? 'min-h-screen bg-[#0a0a0a] text-white' : 'min-h-screen bg-slate-50 text-slate-900'

  return (
    <Router>
      <div className={appClasses}>
        {!isAdminRoute && <Navbar />}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<></>} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
