'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const PayOnDeliveryContext = createContext()

export const SHIPPING_FEE = 8000 // ARS 8.000
export const MAX_ITEMS_POD = 6 // Máximo 6 jerseys

export function PayOnDeliveryProvider({ children }) {
  const [payOnDeliveryEnabled, setPayOnDeliveryEnabled] = useState(false)
  const [hasSeenPopup, setHasSeenPopup] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedEnabled = localStorage.getItem('payOnDeliveryEnabled') === 'true'
    const savedPopup = localStorage.getItem('blackFridayPopupSeen') === 'true'

    setPayOnDeliveryEnabled(savedEnabled)
    setHasSeenPopup(savedPopup)
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('payOnDeliveryEnabled', payOnDeliveryEnabled)
  }, [payOnDeliveryEnabled])

  const enablePayOnDelivery = () => {
    setPayOnDeliveryEnabled(true)

    // Track event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'PayOnDeliveryEnabled')
    }
  }

  const disablePayOnDelivery = () => {
    setPayOnDeliveryEnabled(false)
  }

  const markPopupAsSeen = () => {
    setHasSeenPopup(true)
    localStorage.setItem('blackFridayPopupSeen', 'true')

    // Track event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'BlackFridayPopupViewed')
    }
  }

  const calculatePayOnDeliveryTotals = (cartItems, subtotal) => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const isValid = itemCount <= MAX_ITEMS_POD && itemCount > 0

    return {
      itemCount,
      isValid,
      payNow: isValid ? SHIPPING_FEE : subtotal,
      payOnDelivery: isValid ? subtotal : 0,
      total: subtotal + SHIPPING_FEE,
      shipping: SHIPPING_FEE,
      maxItemsReached: itemCount > MAX_ITEMS_POD
    }
  }

  return (
    <PayOnDeliveryContext.Provider
      value={{
        payOnDeliveryEnabled,
        hasSeenPopup,
        enablePayOnDelivery,
        disablePayOnDelivery,
        markPopupAsSeen,
        calculatePayOnDeliveryTotals,
        SHIPPING_FEE,
        MAX_ITEMS_POD
      }}
    >
      {children}
    </PayOnDeliveryContext.Provider>
  )
}

export function usePayOnDelivery() {
  const context = useContext(PayOnDeliveryContext)
  if (!context) {
    throw new Error('usePayOnDelivery must be used within PayOnDeliveryProvider')
  }
  return context
}
