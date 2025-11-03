'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const PromotionalBanner = () => {
  const [currentPromo, setCurrentPromo] = useState(0)

  // Alternar entre as promoções a cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev === 0 ? 1 : 0))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const promos = [
    {
      id: 'promo-3x1',
      href: '/#bestsellers',
      bgColor: 'from-brand-yellow/95 via-brand-yellow to-brand-yellow/95',
      textColor: 'text-black',
      emoji: '🔥',
      title: 'COMPRA 1 LLEVA 3',
      subtitle: '• Oferta Exclusiva •',
      ariaLabel: 'Compra 1 Lleva 3 - Promoción Foltz Fanwear'
    },
    {
      id: 'promo-pod',
      href: '/#bestsellers',
      bgColor: 'from-orange-500/95 via-red-600 to-orange-500/95',
      textColor: 'text-white',
      emoji: '💳',
      title: 'PAGÁ AL RECIBIR',
      subtitle: '• Black Friday •',
      ariaLabel: 'Pago al Recibir - Black Friday Foltz'
    }
  ]

  const promo = promos[currentPromo]

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full z-[60] bg-black pb-2 md:pb-3"
    >
      <Link
        href={promo.href}
        className="block w-full h-14 md:h-16 relative overflow-hidden group"
        aria-label={promo.ariaLabel}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${promo.bgColor}`} />
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl">{promo.emoji}</span>
                <span className={`${promo.textColor} font-black text-base md:text-xl uppercase tracking-wider`}>
                  {promo.title}
                </span>
                <span className={`${promo.textColor} font-bold text-sm md:text-base`}>
                  {promo.subtitle}
                </span>
                <span className="text-2xl md:text-3xl">{promo.emoji}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Link>
    </motion.div>
  )
}

export default PromotionalBanner
