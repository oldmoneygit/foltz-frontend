'use client'

import Link from 'next/link'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { useCart } from '@/contexts/CartContext'

export default function CarrinhoPage() {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, saveCart } = useCart()

  const handleUpdateQuantity = (id, size, newQuantity) => {
    updateQuantity(id, size, newQuantity)
  }

  const handleRemoveItem = (id, size) => {
    removeFromCart(id, size)
  }

  const subtotal = getSubtotal()

  // Calcular quantidade TOTAL de produtos (soma de todas as quantities)
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6 md:pt-8 pb-4 md:pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-brand-yellow transition-colors text-sm md:text-base"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a la tienda
        </Link>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 uppercase">
              Carrito de Compras
            </h1>
            <p className="text-white/60 text-sm md:text-base">
              {totalQuantity === 0
                ? 'Tu carrito está vacío'
                : `${totalQuantity} ${totalQuantity === 1 ? 'producto' : 'productos'} en tu carrito`}
            </p>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-16 md:py-20">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-white/30" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Tu carrito está vacío
              </h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Parece que aún no has agregado ningún producto. ¡Explora nuestra colección!
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black px-8 py-3 rounded-lg font-bold text-base md:text-lg uppercase tracking-wide hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-yellow/20"
              >
                Explorar Productos
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.size}`}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Right Column - Summary */}
              <div className="lg:col-span-1">
                <CartSummary subtotal={subtotal} cartItems={cartItems} saveCart={saveCart} />
              </div>
            </div>
          )}

          {/* Promotional Banner - Compra 1 Lleva 3 - APENAS com 3+ produtos (quantidade total) */}
          {totalQuantity >= 3 ? (
            <div className="mt-8 md:mt-12 bg-gradient-to-r from-green-500/10 to-green-500/5 border-2 border-green-500/30 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-black">3x1</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    ¡Promoción 3x1 Activada! 🎉
                  </h3>
                  <p className="text-white/80 text-sm md:text-base">
                    ¡Los 2 productos de menor valor son GRATIS! Descuento aplicado automáticamente.
                  </p>
                </div>
              </div>
            </div>
          ) : totalQuantity >= 1 ? (
            <div className="mt-8 md:mt-12 bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center">
                    <span className="text-black text-2xl font-black">3x1</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    ¡Agrega {3 - totalQuantity} Producto{3 - totalQuantity > 1 ? 's' : ''} Más!
                  </h3>
                  <p className="text-white/80 text-sm md:text-base">
                    Activa la promoción 3x1 y los 2 productos de menor valor serán GRATIS!
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
    <Footer />
    </>
  )
}
