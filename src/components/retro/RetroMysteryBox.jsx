'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Sparkles, ShoppingBag, X, Check } from 'lucide-react'
import Image from 'next/image'

const PRICE_TIERS = [
  { quantity: 1, price: 32900, discount: 0, label: 'Única' },
  { quantity: 2, price: 59800, discount: 10, label: 'Doble' },
  { quantity: 3, price: 82350, discount: 20, label: 'Triple' },
  { quantity: 4, price: 98700, discount: 35, label: 'Cuádruple' },
  { quantity: 5, price: 109750, discount: 50, label: 'Mega Pack' },
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function RetroMysteryBox() {
  const [selectedTier, setSelectedTier] = useState(0)
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')

  const currentTier = PRICE_TIERS[selectedTier]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeModal(true)
    } else {
      // Add to cart logic here
      console.log(`Adding ${currentTier.quantity} mystery box(es) size ${selectedSize}`)
    }
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-purple-950/30 via-black to-black">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full mb-4">
            <Gift className="text-purple-400" size={20} />
            <span className="text-purple-400 font-bold text-sm">SORPRESA</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            ¿TE ANIMÁS A LA SORPRESA?
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Elegí tu talle y recibí camisetas retro aleatorias. ¡Mientras más llevás, más ahorrás!
          </p>
        </motion.div>

        {/* Mystery Box Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-pink-900/30 rounded-3xl p-6 md:p-10 border border-purple-500/30">
            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4 text-center">
                ¿Cuántas camisetas querés?
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {PRICE_TIERS.map((tier, index) => (
                  <motion.button
                    key={tier.quantity}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTier(index)}
                    className={`relative px-6 py-3 rounded-xl font-bold transition-all ${
                      selectedTier === index
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                    }`}
                  >
                    <span className="text-2xl">{tier.quantity}</span>
                    {tier.discount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        -{tier.discount}%
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Display */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-gray-400 line-through text-xl">
                  {formatPrice(32900 * currentTier.quantity)}
                </span>
                <span className="text-4xl md:text-5xl font-black text-white">
                  {formatPrice(currentTier.price)}
                </span>
              </div>
              <p className="text-purple-400 font-medium">
                {currentTier.label} - {currentTier.quantity} camiseta{currentTier.quantity > 1 ? 's' : ''} retro
              </p>
              {currentTier.discount > 0 && (
                <p className="text-pink-400 text-sm mt-1">
                  ¡Ahorrás {formatPrice((32900 * currentTier.quantity) - currentTier.price)}!
                </p>
              )}
            </div>

            {/* Size Selector (inline) */}
            <div className="mb-6">
              <h4 className="text-white font-bold mb-3 text-center text-sm">
                Elegí tu talle:
              </h4>
              <div className="flex justify-center gap-2 flex-wrap">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg font-bold transition-all ${
                      selectedSize === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow"
            >
              <ShoppingBag size={24} />
              AGREGAR AL CARRITO
            </motion.button>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Check className="text-green-500" size={18} />
                <span className="text-sm">Envío Gratis</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Sparkles className="text-purple-400" size={18} />
                <span className="text-sm">Sorpresa Garantizada</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Gift className="text-pink-400" size={18} />
                <span className="text-sm">Calidad Premium</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Size Modal */}
        <AnimatePresence>
          {showSizeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSizeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold text-xl">Elegí tu talle</h3>
                  <button
                    onClick={() => setShowSizeModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size)
                        setShowSizeModal(false)
                      }}
                      className="bg-zinc-800 hover:bg-purple-600 text-white py-4 rounded-lg font-bold transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
