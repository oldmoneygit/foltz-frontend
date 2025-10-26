'use client'

import { ShoppingCart, Truck, Tag, CreditCard } from 'lucide-react'

const CartSummary = ({ subtotal, cartItems }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Calcular quantidade TOTAL de produtos (soma de todas as quantities)
  const totalQuantity = cartItems && cartItems.length > 0
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0

  // Cálculo da promoção 2x1 (produto de menor valor GRÁTIS) - APENAS com 2+ produtos (quantidade total)
  let discount = 0
  let cheapestProduct = null

  if (totalQuantity >= 2 && cartItems && cartItems.length > 0) {
    // Encontrar o produto de menor valor (preço unitário)
    cheapestProduct = cartItems.reduce((min, item) => {
      return item.price < min.price ? item : min
    }, cartItems[0])

    // Desconto é o valor do produto mais barato (fica grátis)
    discount = cheapestProduct.price
  }

  const shipping = 0 // Envío gratis
  const total = subtotal - discount + shipping

  // Format values
  const formattedSubtotal = formatPrice(subtotal)
  const formattedDiscount = formatPrice(discount)
  const formattedTotal = formatPrice(total)

  // Verificar se promoção está ativa (baseado na quantidade total)
  const hasPromotion = totalQuantity >= 2

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

          {/* Discount 2x1 - APENAS se tiver 2+ produtos */}
          {hasPromotion ? (
            <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <Tag className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-green-500 text-sm font-bold">Promo 2x1</span>
                  <span className="text-green-500 font-bold">
                    -{formattedDiscount}
                  </span>
                </div>
                <p className="text-green-500/80 text-xs">
                  ¡Producto de menor valor GRATIS!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg p-3">
              <Tag className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-brand-yellow text-xs font-semibold">
                  {totalQuantity === 0
                    ? '¡Agrega productos para activar la promo 2x1!'
                    : `¡Agrega ${2 - totalQuantity} producto${2 - totalQuantity > 1 ? 's' : ''} más para activar la promo 2x1!`
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
            {hasPromotion && (
              <p className="text-green-500 text-xs text-right font-semibold">
                ¡Ahorraste {formattedDiscount}!
              </p>
            )}
          </div>
        </div>

        {/* Checkout Button */}
        <button
          className="w-full bg-brand-yellow text-black py-4 rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-yellow-400 active:scale-95 transition-all duration-300 shadow-lg shadow-brand-yellow/20 flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          Finalizar Compra
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
    </div>
  )
}

export default CartSummary
