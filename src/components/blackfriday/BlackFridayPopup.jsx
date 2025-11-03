'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flame, Check, CreditCard, Package, Clock, Truck } from 'lucide-react'
import { usePayOnDelivery } from '@/contexts/PayOnDeliveryContext'

export default function BlackFridayPopup() {
  const { hasSeenPopup, markPopupAsSeen, enablePayOnDelivery } = usePayOnDelivery()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!hasSeenPopup) {
      // Show popup after 2.5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [hasSeenPopup])

  const handleClose = () => {
    setIsOpen(false)
    markPopupAsSeen()
  }

  const handleAccept = () => {
    enablePayOnDelivery()
    setIsOpen(false)
    markPopupAsSeen()

    // Scroll to products
    const productsSection = document.getElementById('bestsellers')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg z-[9999]"
          >
            <div className="relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-yellow-400">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Icon */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                className="flex justify-center mb-4"
              >
                <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full">
                  <Flame className="w-12 h-12 text-white" fill="currentColor" />
                </div>
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-black text-center uppercase mb-2">
                <span className="text-yellow-400">🎁 BLACK FRIDAY</span>
                <br />
                <span className="text-white">FOLTZ</span>
              </h2>

              <p className="text-xl md:text-2xl font-black text-center text-yellow-400 mb-6">
                PAGUE SÓ QUANDO RECEBER!
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Até 6 jerseys</p>
                    <p className="text-white/60 text-sm">Escolha seus favoritos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <Truck className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Pague só o frete: <span className="text-yellow-400">ARS 8.000</span></p>
                    <p className="text-white/60 text-sm">Agora no checkout</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <Package className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Restante na entrega</p>
                    <p className="text-white/60 text-sm">Quando receber em casa</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CreditCard className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Todos os métodos</p>
                    <p className="text-white/60 text-sm">Cartão, Mercado Pago, dinheiro...</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={handleAccept}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black uppercase text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                QUERO APROVEITAR
              </motion.button>

              <button
                onClick={handleClose}
                className="w-full mt-3 py-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
