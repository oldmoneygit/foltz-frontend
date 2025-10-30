'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { trackAddToCart, trackInitiateCheckout } from '@/components/MetaPixel'

const CartContext = createContext()

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('foltz_cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)

        // Suportar formato novo {items, timestamp, version} e antigo (array direto)
        if (Array.isArray(parsed)) {
          // Formato antigo - array direto
          setCartItems(parsed)
        } else if (parsed.items && Array.isArray(parsed.items)) {
          // Formato novo - objeto com items, timestamp, version
          setCartItems(parsed.items)
        } else {
          console.warn('Invalid cart format in localStorage, clearing cart')
          localStorage.removeItem('foltz_cart')
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem('foltz_cart')
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const cartData = {
        items: cartItems,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
      localStorage.setItem('foltz_cart', JSON.stringify(cartData))
    }
  }, [cartItems, isLoaded])

  // Add item to cart or update quantity if already exists
  const addToCart = (product, size, quantity = 1, customization = null) => {
    setCartItems((prevItems) => {
      // Check if item with same product, size AND customization already exists
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.size == size &&
          JSON.stringify(item.customization) === JSON.stringify(customization)
      )

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.main_image || product.gallery?.[0] || product.images?.[0],
            price: product.price,
            size: size,
            quantity: quantity,
            league: product.league,
            customization: customization, // Personalização opcional
            // Shopify data for checkout
            shopifyId: product.shopifyId,
            variants: product.variants,
            handle: product.handle,
          },
        ]
      }
    })

    // Track AddToCart event no Meta Pixel
    trackAddToCart(product, quantity)
  }

  // Update quantity of an item
  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(id, size)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size == size
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  // Remove item from cart
  const removeFromCart = (id, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.size == size))
    )
  }

  // Força salvamento imediato no localStorage (útil antes de redirecionamento)
  const saveCart = () => {
    const cartData = {
      items: cartItems,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    localStorage.setItem('foltz_cart', JSON.stringify(cartData))
    return true
  }

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('foltz_cart')
  }

  // Get total number of items in cart
  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Get cart subtotal
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Calculate promotion discount (Buy 1 Get 2 Free - 3x1 Promotion)
  const getPromoDiscount = () => {
    if (cartItems.length < 3) return 0

    // Sort items by price (ascending) to get the 2 cheapest items free
    const sortedItems = [...cartItems]
      .map(item => ({ ...item, totalPrice: item.price * item.quantity }))
      .sort((a, b) => a.price - b.price)

    // The 2 cheapest items are free
    const discount = sortedItems[0].price + sortedItems[1].price
    return discount
  }

  // Get total with discount
  const getTotal = () => {
    const subtotal = getSubtotal()
    const discount = getPromoDiscount()
    return subtotal - discount
  }

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveCart,
    getItemCount,
    getSubtotal,
    getPromoDiscount,
    getTotal,
    isLoaded,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
