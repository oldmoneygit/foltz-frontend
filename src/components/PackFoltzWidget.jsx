'use client'

import { useState, useEffect, useRef } from 'react'
import { usePackFoltz } from '@/contexts/PackFoltzContext'
import { useCart } from '@/contexts/CartContext'
import { X, Package, Check, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function PackFoltzWidget() {
  const {
    packItems,
    currentCount,
    packSize,
    packPrice,
    pricePerItem,
    remaining,
    isComplete,
    savings,
    removeFromPack,
    clearPack,
    isLoaded,
  } = usePackFoltz()

  const { removeFromCart, cartItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Ref para evitar sincronização durante remoção manual do pack
  const isSyncingRef = useRef(false)

  // Sincronizar pack com carrinho - se item foi removido do carrinho, remove do pack
  useEffect(() => {
    if (!isLoaded || !cartItems || packItems.length === 0 || isSyncingRef.current) return

    // Criar lista de itens a remover
    const itemsToRemove = []

    // Verificar cada item do pack se ainda está no carrinho
    packItems.forEach((packItem) => {
      const existsInCart = cartItems.some(
        (cartItem) =>
          cartItem.id === packItem.id && cartItem.size === packItem.size
      )

      // Se não está mais no carrinho, marcar para remoção
      if (!existsInCart) {
        itemsToRemove.push({ id: packItem.id, size: packItem.size })
      }
    })

    // Remover itens que não estão mais no carrinho
    if (itemsToRemove.length > 0) {
      isSyncingRef.current = true
      itemsToRemove.forEach((item) => {
        removeFromPack(item.id, item.size)
      })
      // Reset flag after a small delay
      setTimeout(() => {
        isSyncingRef.current = false
      }, 100)
    }
  }, [cartItems, isLoaded]) // Removido packItems e removeFromPack das dependências para evitar loops

  // Fechar drawer com ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Bloquear scroll quando drawer aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Não mostrar se não carregou ou se pack está vazio
  if (!isLoaded || currentCount === 0) return null

  // Handler para remover item do pack E do carrinho
  const handleRemoveFromPack = (item) => {
    removeFromPack(item.id, item.size)
    if (removeFromCart) {
      removeFromCart(item.id, item.size)
    }
  }

  // Handler para limpar todo o pack
  const handleClearPack = () => {
    if (removeFromCart) {
      packItems.forEach((item) => {
        removeFromCart(item.id, item.size)
      })
    }
    clearPack()
    setIsOpen(false)
  }

  // Handler para ir ao carrinho
  const handleGoToCart = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: 'Pack Foltz',
        content_ids: packItems.map(item => item.id),
        content_type: 'product_group',
        value: packPrice,
        currency: 'ARS',
        num_items: packSize
      })
    }

    setShowSuccess(true)
    setTimeout(() => {
      clearPack()
      setShowSuccess(false)
      setIsOpen(false)
    }, 1500)
  }

  return (
    <>
      {/* Floating Button - Trigger - Glassmorphism */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-3 top-1/2 -translate-y-1/2 z-40 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-2.5 rounded-xl border border-white/20 hover:border-brand-yellow/50 transition-all duration-300 group"
        aria-label="Ver Pack Foltz"
      >
        <div className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-brand-yellow" />
          <span className="text-xs font-semibold">
            {currentCount}/{packSize}
          </span>
        </div>
      </button>

      {/* Backdrop + Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Drawer - Glassmorphism clean & compact */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="fixed right-3 top-3 bottom-3 w-[calc(100%-1.5rem)] max-w-xs bg-black/80 backdrop-blur-xl z-50 flex flex-col rounded-2xl border border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="bg-brand-yellow p-2 rounded-lg">
                    <Package className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-sm">PACK FOLTZ</h2>
                    <p className="text-brand-yellow text-xs font-semibold">
                      {currentCount}/{packSize}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* Progress Bar */}
                <div className="bg-white/5 backdrop-blur rounded-lg p-2.5 border border-white/10">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/60">Progreso</span>
                    {isComplete ? (
                      <span className="text-green-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Listo
                      </span>
                    ) : (
                      <span className="text-brand-yellow font-semibold">
                        -{remaining}
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentCount / packSize) * 100}%` }}
                      transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                      className="h-full bg-brand-yellow rounded-full"
                    />
                  </div>
                </div>

                {/* Price Info */}
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3 text-center">
                  <div className="text-xl font-black text-brand-yellow">
                    ARS {packPrice.toLocaleString('es-AR')}
                  </div>
                  <div className="text-[10px] text-white/50 mt-0.5">
                    {packSize} productos • ARS {pricePerItem.toLocaleString('es-AR')} c/u
                  </div>
                  {isComplete && savings > 0 && (
                    <div className="text-green-400 mt-1.5 font-semibold bg-green-500/10 rounded py-1 text-xs">
                      Ahorrás ARS {savings.toLocaleString('es-AR')}
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white/80 font-semibold text-xs">Productos</h3>
                    <button
                      onClick={handleClearPack}
                      className="text-[10px] text-red-400/80 hover:text-red-400 transition"
                    >
                      Limpiar
                    </button>
                  </div>

                  {/* Items Grid - Compact glassmorphism */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[...Array(packSize)].map((_, index) => {
                      const item = packItems[index]

                      if (item) {
                        return (
                          <motion.div
                            key={`${item.id}-${item.size}-${index}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="relative bg-white/5 backdrop-blur rounded-lg overflow-hidden border border-white/10 group"
                          >
                            <div className="aspect-square">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                  <Package className="w-5 h-5 text-white/30" />
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-1.5">
                              <p className="text-white text-[9px] font-medium line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-brand-yellow text-[9px] font-bold">
                                {item.size}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveFromPack(item)}
                              className="absolute top-1 right-1 bg-black/60 hover:bg-red-500/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"
                              title="Quitar"
                            >
                              <X className="w-2.5 h-2.5 text-white" />
                            </button>
                          </motion.div>
                        )
                      }

                      return (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-lg flex items-center justify-center"
                        >
                          <Package className="w-4 h-4 text-white/20" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer - CTA */}
              <div className="p-3 border-t border-white/10">
                {showSuccess ? (
                  <div className="bg-green-500/20 text-green-400 py-3 rounded-lg text-center font-semibold flex items-center justify-center gap-2 text-sm border border-green-500/30">
                    <Check className="w-4 h-4" />
                    Pack listo
                  </div>
                ) : isComplete ? (
                  <Link
                    href="/carrito"
                    onClick={handleGoToCart}
                    className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    FINALIZAR
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-lg font-semibold text-xs transition-all border border-white/10"
                  >
                    Seguir comprando ({remaining})
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
