const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getHeaders = (isAdmin = false) => {
  const key = isAdmin ? 'adminToken' : 'userToken'
  const token = localStorage.getItem(key)
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

// Products
export const getProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetch(`${BASE_URL}/products?${query}`).then(r => r.json())
}
export const getProduct = (id) => fetch(`${BASE_URL}/products/${id}`).then(r => r.json())
export const createProduct = (data) => fetch(`${BASE_URL}/products`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }).then(r => r.json())
export const updateProduct = (id, data) => fetch(`${BASE_URL}/products/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }).then(r => r.json())
export const deleteProduct = (id) => fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE', headers: getHeaders(true) }).then(r => r.json())

// Categories
export const getCategories = () => fetch(`${BASE_URL}/categories`).then(r => r.json())
export const createCategory = (data) => fetch(`${BASE_URL}/categories`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }).then(r => r.json())
export const deleteCategory = (id) => fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE', headers: getHeaders(true) }).then(r => r.json())

// Orders
export const placeOrder = (data) => fetch(`${BASE_URL}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())
export const getMyOrders = () => fetch(`${BASE_URL}/orders/my`, { headers: getHeaders(false) }).then(r => r.json())
export const getAllOrders = () => fetch(`${BASE_URL}/orders`, { headers: getHeaders(true) }).then(r => r.json())
export const updateOrder = (id, data) => fetch(`${BASE_URL}/orders/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }).then(r => r.json())
export const cancelOrder = (id) => fetch(`${BASE_URL}/orders/${id}`, { method: 'PUT', headers: getHeaders(false), body: JSON.stringify({ status: 'cancelled' }) }).then(r => r.json())

// Stripe Payment
export const createPaymentIntent = (data) => fetch(`${BASE_URL}/payment/create-payment-intent`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())
export const confirmStripePayment = (data) => fetch(`${BASE_URL}/payment/confirm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())

// Auth
export const adminLogin = (data) => fetch(`${BASE_URL}/auth/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())
export const userLogin = (data) => fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())
export const userRegister = (data) => fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())

// Admin stats
export const getStats = () => fetch(`${BASE_URL}/admin/stats`, { headers: getHeaders(true) }).then(r => r.json())
