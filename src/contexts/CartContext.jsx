'use client'

import { createContext, useContext, useState, useEffect } from 'react'

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
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('foltz_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  // Add item to cart or update quantity if already exists
  const addToCart = (product, size, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if item with same product and size already exists
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size == size
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
          },
        ]
      }
    })
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

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([])
  }

  // Get total number of items in cart
  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Get cart subtotal
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Calculate promotion discount (Buy 2 Get 1 Free)
  const getPromoDiscount = () => {
    if (cartItems.length < 2) return 0

    // Sort items by price (ascending) to get cheapest item free
    const sortedItems = [...cartItems]
      .map(item => ({ ...item, totalPrice: item.price * item.quantity }))
      .sort((a, b) => a.price - b.price)

    // The cheapest item is free
    return sortedItems[0].price
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
    getItemCount,
    getSubtotal,
    getPromoDiscount,
    getTotal,
    isLoaded,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
