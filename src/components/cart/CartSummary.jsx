'use client'

import { useState } from 'react'
import { ShoppingCart, Truck, Tag, CreditCard, Loader2 } from 'lucide-react'
import { createCheckoutWithItems, findVariantBySize } from '@/lib/shopify'
import { triggerInitiateCheckout } from '@/components/MetaPixelEvents'
import { addUTMsToURL } from '@/utils/utmTracking'

const CartSummary = ({ subtotal, cartItems, saveCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)

  // Formata o preço como "AR$ XX.XXX,XX"
  const formatPrice = (value) => {
    const formatted = value.toFixed(2).replace('.', ',')
    const parts = formatted.split(',')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `AR$ ${parts.join(',')}`
  }

  // Calcular quantidade TOTAL de produtos (soma de todas as quantities)
  const totalQuantity = cartItems && cartItems.length > 0
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0

  // Cálculo da promoção 3x1 (2 produtos de menor valor GRÁTIS) - APENAS com 3+ produtos (quantidade total)
  let discount = 0
  let cheapestProducts = []

  if (totalQuantity >= 3 && cartItems && cartItems.length > 0) {
    // Ordenar produtos por preço (do menor para o maior)
    const sortedByPrice = [...cartItems].sort((a, b) => a.price - b.price)

    // Pegar os 2 produtos de menor valor
    cheapestProducts = sortedByPrice.slice(0, 2)

    // Desconto é a soma dos 2 produtos mais baratos (ficam grátis)
    discount = cheapestProducts.reduce((sum, item) => sum + item.price, 0)
  }

  const shipping = 0 // Envío gratis
  const total = subtotal - discount + shipping

  // Format values
  const formattedSubtotal = formatPrice(subtotal)
  const formattedDiscount = formatPrice(discount)
  const formattedTotal = formatPrice(total)

  // Verificar se promoção está ativa (baseado na quantidade total)
  const hasPromotion = totalQuantity >= 3

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

      for (const item of cartItems) {
        // Find the correct variant ID based on size
        if (!item.variants || item.variants.length === 0) {
          console.error(`Product ${item.name} doesn't have variants data`)
          continue
        }

        // Adaptar estrutura: variants pode ser array direto ou objeto com edges
        const variantsData = Array.isArray(item.variants)
          ? { edges: item.variants }
          : item.variants

        const variantId = findVariantBySize(variantsData, item.size)

        if (!variantId) {
          console.error(`Variant not found for ${item.name} - Size: ${item.size}`)
          console.log('Available variants:', variantsData)
          throw new Error(`No se encontró la talla ${item.size} para ${item.name}`)
        }

        lineItems.push({
          variantId: variantId,
          quantity: item.quantity
        })
      }

      if (lineItems.length === 0) {
        throw new Error('No se pudieron procesar los productos del carrito')
      }

      // Track InitiateCheckout event ANTES de redirecionar
      trackInitiateCheckout(cartItems, total)

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
        console.log('[Checkout] Redirecting with UTMs:', checkoutUrlWithUTMs)
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
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Subtotal ({totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'})</span>
            <span className="text-white font-semibold">
              {formattedSubtotal}
            </span>
          </div>

          {/* Discount 3x1 - APENAS se tiver 3+ produtos */}
          {hasPromotion ? (
            <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <Tag className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-green-500 text-sm font-bold">Promo 3x1</span>
                  <span className="text-green-500 font-bold">
                    -{formattedDiscount}
                  </span>
                </div>
                <p className="text-green-500/80 text-xs">
                  ¡Los 2 productos de menor valor GRATIS!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg p-3">
              <Tag className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-brand-yellow text-xs font-semibold">
                  <span className="md:hidden">
                    {totalQuantity === 0
                      ? 'Agrega productos para 3x1'
                      : `Agrega ${3 - totalQuantity} más para 3x1`
                    }
                  </span>
                  <span className="hidden md:inline">
                    {totalQuantity === 0
                      ? '¡Agrega productos para activar la promo 3x1!'
                      : `¡Agrega ${3 - totalQuantity} producto${3 - totalQuantity > 1 ? 's' : ''} más para activar la promo 3x1!`
                    }
                  </span>
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
            {hasPromotion && (
              <p className="text-green-500 text-xs text-right font-semibold">
                ¡Ahorraste {formattedDiscount}!
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

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut || totalQuantity === 0}
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
            <span>Envío rápido 3-5 días</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
            <span>Seguimiento en tiempo real</span>
          </div>
        </div>
      </div>

      {/* Botão Fixo Mobile - Sempre visível ao rolar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-black border-t-2 border-brand-yellow p-4 z-[60] shadow-2xl">
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut || totalQuantity === 0}
          className="w-full bg-brand-yellow text-black py-4 rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

      {/* Espaçador para não sobrepor conteúdo em mobile */}
      <div className="h-24 lg:h-0" />
    </div>
  )
}

export default CartSummary
