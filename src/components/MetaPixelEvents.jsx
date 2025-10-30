'use client'

import { useEffect } from 'react'
import { trackPixelEvent, formatProductData, formatCartData } from '@/utils/metaPixelUtils'

/**
 * ViewContent - Componente para rastrear visualização de produto
 * Usa sessionStorage para prevenir duplicatas
 */
export function ViewContent({ product }) {
  useEffect(() => {
    if (!product) return

    // Prevenir duplicatas
    const productId = product.id || product.slug
    const tracked = sessionStorage.getItem(`viewcontent_${productId}`)

    if (!tracked) {
      const eventData = formatProductData(product)
      trackPixelEvent('ViewContent', eventData)

      // Marcar como rastreado
      sessionStorage.setItem(`viewcontent_${productId}`, Date.now().toString())
    }
  }, [product])

  return null
}

/**
 * AddToCart - Função para rastrear adição ao carrinho
 */
export function triggerAddToCart(product, quantity = 1) {
  if (!product) return

  const eventData = {
    ...formatProductData(product),
    quantity,
  }

  trackPixelEvent('AddToCart', eventData)
}

/**
 * InitiateCheckout - Função para rastrear início de checkout
 */
export function triggerInitiateCheckout(cartItems) {
  if (!cartItems || cartItems.length === 0) return

  const eventData = formatCartData(cartItems)
  trackPixelEvent('InitiateCheckout', eventData)
}

/**
 * AddToWishlist - Função para rastrear adição aos favoritos
 */
export function triggerAddToWishlist(product) {
  if (!product) return

  const eventData = formatProductData(product)
  trackPixelEvent('AddToWishlist', eventData)
}

/**
 * Search - Função para rastrear busca
 */
export function triggerSearch(searchQuery) {
  if (!searchQuery) return

  trackPixelEvent('Search', {
    search_string: searchQuery,
  })
}

/**
 * Lead - Função para rastrear lead (formulário de contato, newsletter, etc)
 */
export function triggerLead(leadData = {}) {
  trackPixelEvent('Lead', leadData)
}

/**
 * CompleteRegistration - Função para rastrear registro completo
 */
export function triggerCompleteRegistration(userData = {}) {
  trackPixelEvent('CompleteRegistration', {}, userData)
}
