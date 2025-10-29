'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const PromotionalBanner = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full z-[60] bg-black pb-2 md:pb-3"
    >
      <Link
        href="/#bestsellers"
        className="block w-full h-14 md:h-16 relative overflow-hidden group"
        aria-label="Compra 1 Lleva 2 - Promoción Foltz Fanwear"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/95 via-brand-yellow to-brand-yellow/95" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">🔥</span>
            <span className="text-black font-black text-base md:text-xl uppercase tracking-wider">
              COMPRA 1 LLEVA 3
            </span>
            <span className="text-black font-bold text-sm md:text-base">
              • Oferta Exclusiva •
            </span>
            <span className="text-2xl md:text-3xl">🔥</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PromotionalBanner
