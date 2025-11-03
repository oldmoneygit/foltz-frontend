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
        aria-label="Combo 3 Camisetas por ARS 32.900 - Black Friday Foltz"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/95 via-red-600 to-orange-500/95" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">🔥</span>
            <span className="text-white font-black text-base md:text-xl uppercase tracking-wider">
              COMBO 3 CAMISETAS: ARS 32.900
            </span>
            <span className="text-yellow-300 font-bold text-sm md:text-base">
              • Envío GRATIS • Black Friday •
            </span>
            <span className="text-2xl md:text-3xl">🔥</span>
          </div>
        </div>

        {/* Animated pulse effect */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </Link>
    </motion.div>
  )
}

export default PromotionalBanner
