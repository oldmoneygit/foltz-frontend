'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const Combo3xContext = createContext()

export const COMBO_PRICE = 49900 // ARS 49.900 por 3 camisetas (Pack Insano)
export const COMBO_SIZE = 3 // Pack de 3 jerseys
export const COMBO_ORIGINAL_PRICE = 110700 // ARS 110.700 (precio normal sin descuento)
export const COMBO_DISCOUNT = 55 // 55% OFF
export const SHIPPING_FEE = 0 // Envio gratis incluído

export function Combo3xProvider({ children }) {
  const [hasSeenPopup, setHasSeenPopup] = useState(false)
  const [combo3xEnabled, setCombo3xEnabled] = useState(true) // Promoção sempre ativa

  // Load state from localStorage on mount
  useEffect(() => {
    const savedPopup = localStorage.getItem('combo3xPopupSeen') === 'true'
    setHasSeenPopup(savedPopup)
  }, [])

  const markPopupAsSeen = () => {
    setHasSeenPopup(true)
    localStorage.setItem('combo3xPopupSeen', 'true')

    // Track event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'Combo3xPopupViewed')
    }
  }

  /**
   * Calcula o total com a lógica do Combo 3x
   *
   * Lógica:
   * - Se < 3 produtos: preço normal
   * - Se = 3 produtos: ARS 32.900 (combo)
   * - Se > 3 produtos:
   *   - Divide em combos completos (cada 3 = ARS 32.900)
   *   - Produtos restantes pagam preço normal
   *
   * Exemplo:
   * - 3 jerseys: ARS 32.900
   * - 4 jerseys: ARS 32.900 (combo) + preço do 4º
   * - 6 jerseys: ARS 65.800 (2 combos)
   */
  const calculateCombo3xTotals = (cartItems) => {
    if (!cartItems || cartItems.length === 0) {
      return {
        itemCount: 0,
        hasCombo: false,
        fullCombos: 0,
        remainingItems: 0,
        subtotalNormal: 0,
        subtotalCombo: 0,
        savings: 0,
        total: 0,
        shipping: SHIPPING_FEE
      }
    }

    // Calcular quantidade total
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    // Calcular subtotal normal (sem combo)
    const subtotalNormal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Se menos de 3 produtos, não tem combo
    if (itemCount < 3) {
      return {
        itemCount,
        hasCombo: false,
        fullCombos: 0,
        remainingItems: itemCount,
        subtotalNormal,
        subtotalCombo: subtotalNormal,
        savings: 0,
        total: subtotalNormal + SHIPPING_FEE,
        shipping: SHIPPING_FEE,
        productsNeeded: 3 - itemCount
      }
    }

    // Calcular combos completos e items restantes
    const fullCombos = Math.floor(itemCount / COMBO_SIZE)
    const remainingItems = itemCount % COMBO_SIZE

    // Calcular preço com combo
    let subtotalCombo = fullCombos * COMBO_PRICE

    // Adicionar preço dos produtos restantes (que não completam combo)
    // Pegar os produtos mais caros para os restantes (mais vantagem pro cliente)
    if (remainingItems > 0) {
      const sortedByPrice = [...cartItems].sort((a, b) => b.price - a.price)
      let itemsToAdd = remainingItems

      for (const item of sortedByPrice) {
        if (itemsToAdd === 0) break
        const quantityToUse = Math.min(item.quantity, itemsToAdd)
        subtotalCombo += item.price * quantityToUse
        itemsToAdd -= quantityToUse
      }
    }

    const savings = subtotalNormal - subtotalCombo
    const total = subtotalCombo + SHIPPING_FEE

    return {
      itemCount,
      hasCombo: true,
      fullCombos,
      remainingItems,
      subtotalNormal,
      subtotalCombo,
      savings,
      total,
      shipping: SHIPPING_FEE
    }
  }

  return (
    <Combo3xContext.Provider
      value={{
        combo3xEnabled,
        hasSeenPopup,
        markPopupAsSeen,
        calculateCombo3xTotals,
        COMBO_PRICE,
        COMBO_SIZE,
        COMBO_ORIGINAL_PRICE,
        COMBO_DISCOUNT,
        SHIPPING_FEE
      }}
    >
      {children}
    </Combo3xContext.Provider>
  )
}

export function useCombo3x() {
  const context = useContext(Combo3xContext)
  if (!context) {
    throw new Error('useCombo3x must be used within Combo3xProvider')
  }
  return context
}
