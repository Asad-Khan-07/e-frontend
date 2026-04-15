import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

const getInitialCart = () => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  } catch {
    return []
  }
}

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark'
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(getInitialCart)
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  const cartCount = cart.length
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  // Currency conversion: 1 USD = 280 PKR (approximate current rate)
  const convertToUSD = (pkrAmount) => {
    return Math.round((pkrAmount / 280) * 100) / 100 // Round to 2 decimal places
  }

  return (
    <CartContext.Provider value={{ cart, setCart, cartCount, theme, toggleTheme, convertToUSD }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

export function useTheme() {
  return useContext(CartContext)
}