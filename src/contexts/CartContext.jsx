'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { triggerAddToCart } from '@/components/MetaPixelEvents'

const CartContext = createContext()

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage immediately (SSR-safe)
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('foltz_cart')
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart)
          if (Array.isArray(parsed)) {
            return parsed
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      }
    }
    return []
  })
  const [isLoaded, setIsLoaded] = useState(false)

  // Mark as loaded after initial render
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('foltz_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  // Add item to cart or update quantity if already exists
  const addToCart = (product, size, quantity = 1, customization = null) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.size === size &&
          JSON.stringify(item.customization) === JSON.stringify(customization)
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
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
            customization: customization,
            shopifyId: product.shopifyId,
            variants: product.variants,
            handle: product.handle,
          },
        ]
      }
    })

    triggerAddToCart(product, quantity)
  }

  // Update quantity of an item
  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(id, size)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  // Remove item from cart
  const removeFromCart = (id, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.size === size))
    )
  }

  // Force save to localStorage
  const saveCart = () => {
    localStorage.setItem('foltz_cart', JSON.stringify(cartItems))
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

    const sortedItems = [...cartItems]
      .map(item => ({ ...item, totalPrice: item.price * item.quantity }))
      .sort((a, b) => a.price - b.price)

    const discount = sortedItems[0].price + sortedItems[1].price
    return discount
  }

  // Calculate Pack Foltz discount
  const getPackFoltzDiscount = (packItems = [], packPrice = 59900) => {
    if (!packItems || packItems.length !== 4) return 0

    const allPackItemsInCart = packItems.every(packItem =>
      cartItems.some(cartItem =>
        cartItem.id === packItem.id && cartItem.size === packItem.size
      )
    )

    if (!allPackItemsInCart) return 0

    const packItemsTotal = packItems.reduce((total, packItem) => {
      const cartItem = cartItems.find(
        ci => ci.id === packItem.id && ci.size === packItem.size
      )
      return total + (cartItem?.price || 0)
    }, 0)

    return packItemsTotal - packPrice
  }

  // Check if an item is part of the pack
  const isPackItem = (itemId, itemSize, packItems = []) => {
    return packItems.some(pi => pi.id === itemId && pi.size === itemSize)
  }

  // Get total with discount
  const getTotal = (packItems = [], packPrice = 59900) => {
    const subtotal = getSubtotal()

    const packDiscount = getPackFoltzDiscount(packItems, packPrice)
    if (packDiscount > 0) {
      return subtotal - packDiscount
    }

    const promoDiscount = getPromoDiscount()
    return subtotal - promoDiscount
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
    getPackFoltzDiscount,
    isPackItem,
    getTotal,
    isLoaded,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
