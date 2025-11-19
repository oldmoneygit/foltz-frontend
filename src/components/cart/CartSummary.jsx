'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Truck, Tag, CreditCard, Loader2 } from 'lucide-react'
import { createCheckoutWithItems, findVariantBySize } from '@/lib/shopify'
import { triggerInitiateCheckout } from '@/components/MetaPixelEvents'
import { addUTMsToURL } from '@/utils/utmTracking'
import { useBlackFriday } from '@/contexts/BlackFridayContext'

const CartSummary = ({ subtotal, cartItems, saveCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)
  const { calculatePackBlackTotals, PACK_BLACK_PRICE, PACK_BLACK_SIZE } = useBlackFriday()

  // Reset checkout state when component mounts or user comes back from checkout
  useEffect(() => {
    // Reset immediately on mount
    setIsCheckingOut(false)
    setCheckoutError(null)

    // Also reset when user navigates back using browser history (bfcache)
    const handlePageShow = (event) => {
      // event.persisted is true when page is restored from bfcache
      if (event.persisted) {
        setIsCheckingOut(false)
        setCheckoutError(null)
      }
    }

    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  // Formata o preço como "AR$ XX.XXX,XX"
  const formatPrice = (value) => {
    const formatted = value.toFixed(2).replace('.', ',')
    const parts = formatted.split(',')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `AR$ ${parts.join(',')}`
  }

  // Calcular dados do Pack Black
  const packData = calculatePackBlackTotals(cartItems)

  // Format values
  const formattedSubtotalNormal = formatPrice(packData.subtotalNormal)
  const formattedSubtotalWithPack = formatPrice(packData.subtotalWithPack)
  const formattedSavings = formatPrice(packData.savings)
  const formattedTotal = formatPrice(packData.total)

  // Handle Shopify Checkout
  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) {
      setCheckoutError('Tu carrito está vacío')
      return
    }

    setIsCheckingOut(true)
    setCheckoutError(null)

    try {
      // Map cart items to Shopify line items
      const lineItems = []
      let isFirstItem = true // Flag para adicionar atributos do combo apenas no primeiro produto

      for (const item of cartItems) {
        // Find the correct variant ID based on size
        if (!item.variants || item.variants.length === 0) {
          continue
        }

        // Adaptar estrutura: variants pode ser array direto ou objeto com edges
        const variantsData = Array.isArray(item.variants)
          ? { edges: item.variants.map(v => ({ node: v })) }
          : item.variants

        const variantId = findVariantBySize(variantsData, item.size)

        if (!variantId) {
          throw new Error(`No se encontró la talla ${item.size} para ${item.name}`)
        }

        // Preparar line item
        const lineItem = {
          variantId: variantId,
          quantity: item.quantity
        }

        // Adicionar personalização como custom attributes
        if (!lineItem.attributes) {
          lineItem.attributes = []
        }

        if (item.customization) {
          // Support both old format (playerName/playerNumber) and new format (name/number)
          const customName = item.customization.name || item.customization.playerName
          const customNumber = item.customization.number || item.customization.playerNumber

          if (customName) {
            lineItem.attributes.push({
              key: '👤 Nombre',
              value: customName
            })
          }

          if (customNumber) {
            lineItem.attributes.push({
              key: '🔢 Número',
              value: customNumber.toString()
            })
          }
        }

        // Add Pack Black attributes APENAS NO PRIMEIRO PRODUTO para evitar confusão
        if (packData.hasPack && isFirstItem) {
          lineItem.attributes.push({
            key: '🔥 PACK FOLTZ',
            value: '✅ Activado'
          })
          lineItem.attributes.push({
            key: '📦 Packs',
            value: `${packData.fullPacks} ${packData.fullPacks === 1 ? 'pack' : 'packs'} (${packData.fullPacks * PACK_BLACK_SIZE} camisetas)`
          })
          lineItem.attributes.push({
            key: '💰 Precio Pack',
            value: `${formatPrice(PACK_BLACK_PRICE)} por ${PACK_BLACK_SIZE} camisetas`
          })
          if (packData.savings > 0) {
            lineItem.attributes.push({
              key: '🎉 Ahorro total',
              value: formatPrice(packData.savings)
            })
          }
          lineItem.attributes.push({
            key: '🚚 Envío',
            value: 'GRATIS incluido'
          })
          isFirstItem = false // Marcar que já adicionamos no primeiro
        }

        // Add Mystery Box attributes
        if (packData.hasMysteryBox && isFirstItem) {
          lineItem.attributes.push({
            key: '📦 MYSTERY BOX',
            value: `${packData.mysteryBoxCount} ${packData.mysteryBoxCount === 1 ? 'box' : 'boxes'}`
          })
          if (packData.mysteryBoxDiscount > 0) {
            lineItem.attributes.push({
              key: '🎉 Descuento Mystery Box',
              value: formatPrice(packData.mysteryBoxDiscount)
            })
          }
        }

        lineItems.push(lineItem)
      }

      if (lineItems.length === 0) {
        throw new Error('No se pudieron procesar los productos del carrito')
      }

      // Track InitiateCheckout event ANTES de redirecionar
      triggerInitiateCheckout(cartItems)

      // Track Pack Black event if active
      if (packData.hasPack) {
        // Track to Meta Pixel
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('trackCustom', 'PackBlackCheckout', {
            currency: 'ARS',
            value: packData.total,
            num_packs: packData.fullPacks,
            num_items: packData.itemCount,
            savings: packData.savings
          })
        }
      }

      // Track Mystery Box event if active
      if (packData.hasMysteryBox) {
        // Track to Meta Pixel
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('trackCustom', 'MysteryBoxCheckout', {
            currency: 'ARS',
            value: packData.total,
            num_boxes: packData.mysteryBoxCount,
            discount: packData.mysteryBoxDiscount
          })
        }
      }

      // Create Shopify checkout
      const checkout = await createCheckoutWithItems(lineItems)

      // Salvar carrinho ANTES de redirecionar (para persistir quando o usuário voltar)
      if (saveCart) {
        saveCart()
      }

      // Redirect to Shopify checkout (com UTMs)
      if (checkout && checkout.webUrl) {
        // Adicionar parâmetros UTM à URL do checkout
        const checkoutUrlWithUTMs = addUTMsToURL(checkout.webUrl)
        window.location.href = checkoutUrlWithUTMs
      } else {
        throw new Error('No se recibió URL de checkout')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setCheckoutError(error.message || 'Error al crear el checkout. Por favor intenta de nuevo.')
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="sticky top-24">
      <div className="bg-white/5 border-2 border-white/10 rounded-xl p-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <ShoppingCart className="w-6 h-6 text-brand-yellow" />
          <h2 className="text-xl font-bold text-white">Resumen del Pedido</h2>
        </div>

        {/* Summary Details */}
        <div className="space-y-4">
          {/* Quantidade de produtos */}
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">
              {packData.itemCount} {packData.itemCount === 1 ? 'producto' : 'productos'}
            </span>
            <span className="text-white/60 text-sm">
              {formattedSubtotalNormal}
            </span>
          </div>

          {/* Personalizações - Display */}
          {cartItems.some(item => item.customization && (item.customization.name || item.customization.number)) && (
            <div className="flex items-start gap-2 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400">✨</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-purple-400 text-sm font-bold block mb-1">
                  Personalizaciones
                </span>
                <div className="space-y-1">
                  {cartItems.filter(item => item.customization && (item.customization.name || item.customization.number)).map((item, idx) => (
                    <p key={idx} className="text-purple-400/80 text-xs">
                      • {item.name.substring(0, 30)}{item.name.length > 30 ? '...' : ''}: {' '}
                      {item.customization.name && <span className="font-semibold">{item.customization.name}</span>}
                      {item.customization.name && item.customization.number && ' '}
                      {item.customization.number && <span className="font-bold">#{item.customization.number}</span>}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pack Black - Display */}
          {packData.hasPack ? (
            <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <Tag className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-green-500 text-sm font-bold">
                    Pack Foltz Activado
                  </span>
                  <span className="text-green-500 font-bold">
                    -{formattedSavings}
                  </span>
                </div>
                <p className="text-green-500/80 text-xs">
                  ¡{packData.fullPacks} {packData.fullPacks === 1 ? 'pack' : 'packs'} de {PACK_BLACK_SIZE} camisetas por ARS {PACK_BLACK_PRICE.toLocaleString()}!
                </p>
              </div>
            </div>
          ) : packData.hasMysteryBox ? (
            <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <Tag className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-green-500 text-sm font-bold">
                    Mystery Box Activado
                  </span>
                  {packData.mysteryBoxDiscount > 0 && (
                    <span className="text-green-500 font-bold">
                      -{formatPrice(packData.mysteryBoxDiscount)}
                    </span>
                  )}
                </div>
                <p className="text-green-500/80 text-xs">
                  ¡{packData.mysteryBoxCount} Mystery {packData.mysteryBoxCount === 1 ? 'Box' : 'Boxes'} con descuento progresivo!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <Tag className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-orange-500 text-xs font-semibold">
                  {packData.itemCount === 0
                    ? `¡Agrega ${PACK_BLACK_SIZE} camisetas para Pack Foltz de ARS ${PACK_BLACK_PRICE.toLocaleString()}!`
                    : `¡Agrega ${packData.productsNeeded} más para Pack Foltz de ARS ${PACK_BLACK_PRICE.toLocaleString()}!`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Shipping */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-white/60" />
              <span className="text-white/60 text-sm">Envío</span>
            </div>
            <span className="text-green-500 font-semibold text-sm">GRATIS</span>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-white/10 pt-4">
            {/* Total */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-lg font-bold">Total</span>
              <span className="text-brand-yellow text-2xl font-black">
                {formattedTotal}
              </span>
            </div>
            {(packData.hasPack || packData.hasMysteryBox) && packData.savings > 0 && (
              <p className="text-green-500 text-xs text-right font-semibold">
                ¡Ahorraste {formattedSavings}!
              </p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {checkoutError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-500 text-sm">{checkoutError}</p>
          </div>
        )}

        {/* Checkout Buttons - DUAL CHECKOUT */}

        {/* Botón Amarillo - Shopify Checkout (Original) */}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut || packData.itemCount === 0}
          className="w-full bg-brand-yellow text-black py-4 rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-yellow-400 active:scale-95 transition-all duration-300 shadow-lg shadow-brand-yellow/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Finalizar Compra
            </>
          )}
        </button>

        {/* Feature Flag Check - Only show if dlocal is enabled */}
        {process.env.NEXT_PUBLIC_ENABLE_DLOCAL_CHECKOUT === 'true' && (
          <>
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-white/40">o</span>
              </div>
            </div>

            {/* Botón Azul - dlocal Checkout (Nuevo) */}
            <Link
              href="/checkout"
              className={`w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-bold text-xs uppercase tracking-wide hover:bg-blue-700 active:scale-95 transition-all duration-300 shadow-lg shadow-blue-600/20 flex items-center justify-center border-2 border-[#DAF10D]/30 hover:border-[#DAF10D]/50 ${
                packData.itemCount === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              <span className="leading-tight text-center">Pagar con efectivo, transferencia o tarjeta de débito</span>
            </Link>

            {/* Info Text */}
            <p className="text-white/40 text-xs text-center -mt-2">
              💳 Aceptamos todas las tarjetas argentinas, transferencias y efectivo
            </p>
          </>
        )}

        {/* Security Badge */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-brand-yellow/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold mb-1">Compra Segura</p>
              <p className="text-white/60 text-xs">
                Protección al comprador y pago 100% seguro
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
            <span>Calidad Premium 1:1</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
            <span>Envío rápido hasta 10 días</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
            <span>Seguimiento en tiempo real</span>
          </div>
        </div>
      </div>

      {/* Botão Fixo Mobile - Sempre visível ao rolar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-black border-t-2 border-brand-yellow p-4 z-[60] shadow-2xl">
        {/* Botão Amarelo - Shopify (Mobile) */}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut || packData.itemCount === 0}
          className="w-full bg-brand-yellow text-black py-4 rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed mb-2"
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Finalizar - {formattedTotal}
            </>
          )}
        </button>

        {/* Botão Azul - dlocal (Mobile) */}
        {process.env.NEXT_PUBLIC_ENABLE_DLOCAL_CHECKOUT === 'true' && packData.itemCount > 0 && (
          <Link
            href="/checkout"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wide hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center shadow-lg border-2 border-[#DAF10D]/30"
          >
            <span className="text-center">Efectivo, transferencia o débito</span>
          </Link>
        )}
      </div>

      {/* Espaçador para não sobrepor conteúdo em mobile */}
      <div className="h-24 lg:h-0" />
    </div>
  )
}

export default CartSummary
