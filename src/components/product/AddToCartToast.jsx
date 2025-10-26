'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShoppingCart, X, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

const AddToCartToast = ({ isOpen, onClose, product, size, quantity }) => {
  // Auto close after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!product) return null

  // Format price
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(product.price)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Toast Container - Top Right on Desktop, Bottom on Mobile */}
          <div className="fixed bottom-0 left-0 right-0 md:top-4 md:right-4 md:bottom-auto md:left-auto p-4 md:p-0 flex justify-center md:justify-end pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 50, x: 0 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50, x: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg md:max-w-xl pointer-events-auto"
            >
              <div className="bg-black border-2 border-green-500/50 rounded-xl shadow-2xl shadow-green-500/20 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 md:px-6 py-3.5 md:py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 md:w-6 md:h-6 text-green-600" strokeWidth={3} />
                    </div>
                    <h3 className="text-white font-bold text-base md:text-lg">
                      ¡Agregado al Carrito!
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white/20 text-white rounded-lg transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="bg-zinc-900 p-5 md:p-6">
                  <div className="flex gap-4 md:gap-5">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.main_image || product.gallery?.[0] || product.images?.[0] || '/images/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="96px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-base md:text-lg line-clamp-2 mb-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-3 md:gap-4 text-sm md:text-base text-white/70 mb-2">
                        <span>Talla: <span className="text-brand-yellow font-semibold">{size}</span></span>
                        <span>•</span>
                        <span>Cantidad: <span className="text-brand-yellow font-semibold">{quantity}</span></span>
                      </div>
                      <p className="text-brand-yellow font-bold text-lg md:text-xl">
                        {formattedPrice}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={onClose}
                      className="flex-1 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm md:text-base font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap"
                    >
                      Seguir Comprando
                    </button>
                    <Link
                      href="/carrito"
                      className="flex-1 px-5 py-3 bg-brand-yellow hover:bg-yellow-400 text-black text-sm md:text-base font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group whitespace-nowrap"
                    >
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Ver Carrito</span>
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-1 bg-green-500 origin-left"
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddToCartToast
