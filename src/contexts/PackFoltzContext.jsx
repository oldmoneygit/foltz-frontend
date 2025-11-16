'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const PackFoltzContext = createContext(null)

export function usePackFoltz() {
  const context = useContext(PackFoltzContext)
  if (!context) {
    throw new Error('usePackFoltz must be used within PackFoltzProvider')
  }
  return context
}

// Constantes da promoção
export const PACK_SIZE = 4
export const PACK_PRICE = 59900 // ARS 59.900
export const PACK_PRICE_PER_ITEM = PACK_PRICE / PACK_SIZE // ARS 14.975 por item

export function PackFoltzProvider({ children }) {
  const [packItems, setPackItems] = useState([])
  const [isPackActive, setIsPackActive] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('foltz-pack-items')
    if (saved) {
      try {
        const items = JSON.parse(saved)
        if (Array.isArray(items)) {
          setPackItems(items)
          setIsPackActive(items.length === PACK_SIZE)
        }
      } catch (error) {
        console.error('Error loading pack items:', error)
        localStorage.removeItem('foltz-pack-items')
      }
    }
    setIsLoaded(true)
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('foltz-pack-items', JSON.stringify(packItems))
      setIsPackActive(packItems.length === PACK_SIZE)
    }
  }, [packItems, isLoaded])

  // Adicionar produto ao pack
  const addToPack = (product, addToCartCallback = null) => {
    if (packItems.length >= PACK_SIZE) {
      return {
        success: false,
        message: `El pack ya está completo (${PACK_SIZE} productos)`,
      }
    }

    // Verificar se produto já está no pack (por id e size)
    const exists = packItems.find(
      item => item.id === product.id && item.size === product.size
    )
    if (exists) {
      return {
        success: false,
        message: 'Este producto ya está en el pack',
      }
    }

    const packItem = {
      id: product.id,
      name: product.name,
      slug: product.slug || product.handle,
      image: product.main_image || product.images?.[0] || product.gallery?.[0],
      price: product.price,
      size: product.size || 'M', // Default size
      league: product.league,
      shopifyId: product.shopifyId,
      variants: product.variants,
      handle: product.handle,
    }

    const newItems = [...packItems, packItem]
    setPackItems(newItems)

    // Adicionar ao carrinho automaticamente se callback fornecido
    if (addToCartCallback && typeof addToCartCallback === 'function') {
      addToCartCallback(product, product.size, 1)
    }

    // Track event no Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'AddToPackFoltz', {
        content_name: product.name,
        content_ids: [product.id],
        value: PACK_PRICE,
        currency: 'ARS',
        pack_progress: `${newItems.length}/${PACK_SIZE}`
      })
    }

    return {
      success: true,
      message: `Producto agregado al pack y carrito (${newItems.length}/${PACK_SIZE})`,
      remaining: PACK_SIZE - newItems.length,
    }
  }

  // Remover produto do pack
  const removeFromPack = useCallback((productId, size) => {
    setPackItems(prevItems =>
      prevItems.filter(item => !(item.id === productId && item.size === size))
    )
  }, [])

  // Limpar pack
  const clearPack = () => {
    setPackItems([])
    setIsPackActive(false)
    localStorage.removeItem('foltz-pack-items')
  }

  // Calcular economia
  const calculateSavings = () => {
    if (packItems.length !== PACK_SIZE) return 0

    const totalOriginal = packItems.reduce((sum, item) => {
      return sum + (item.price || 0)
    }, 0)

    return totalOriginal - PACK_PRICE
  }

  // Verificar se um produto está no pack
  const isInPack = (productId, size = null) => {
    if (size) {
      return packItems.some(item => item.id === productId && item.size === size)
    }
    return packItems.some(item => item.id === productId)
  }

  // Obter dados do pack formatados para adicionar ao carrinho
  const getPackForCart = () => {
    if (!isPackActive || packItems.length !== PACK_SIZE) {
      return null
    }

    return {
      items: packItems,
      packPrice: PACK_PRICE,
      pricePerItem: PACK_PRICE_PER_ITEM,
      savings: calculateSavings(),
    }
  }

  // Formatar preço em ARS
  const formatPrice = (value) => {
    return `ARS ${value.toLocaleString('es-AR')}`
  }

  // Computed values
  const remainingForPack = PACK_SIZE - packItems.length
  const isPackComplete = packItems.length >= PACK_SIZE

  const value = {
    // Estado
    packItems,
    isPackActive,
    isLoaded,

    // Constantes
    packSize: PACK_SIZE,
    packPrice: PACK_PRICE,
    pricePerItem: PACK_PRICE_PER_ITEM,

    // Computed
    currentCount: packItems.length,
    remaining: PACK_SIZE - packItems.length,
    remainingForPack, // Alias para compatibilidade
    isComplete: packItems.length === PACK_SIZE,
    isPackComplete, // Alias para compatibilidade
    savings: calculateSavings(),

    // Ações
    addToPack,
    removeFromPack,
    clearPack,
    isInPack,
    getPackForCart,
    formatPrice,
  }

  return (
    <PackFoltzContext.Provider value={value}>
      {children}
    </PackFoltzContext.Provider>
  )
}
