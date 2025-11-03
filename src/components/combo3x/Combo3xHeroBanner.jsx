'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Truck, Tag, Clock } from 'lucide-react'

export default function Combo3xHeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTI0IDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6TTM2IDZjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bS0yNCAwYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] animate-[slide_20s_linear_infinite]"></div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Main Message */}
          <div className="flex items-center gap-3 md:gap-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" fill="currentColor" />
            </motion.div>

            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                🔥 BLACK FRIDAY FOLTZ 🔥
              </h2>
              <p className="text-base md:text-xl lg:text-2xl text-yellow-300 mt-1 font-black">
                COMPRE 3 CAMISETAS POR ARS 32.900
              </p>
              <p className="text-xs md:text-sm text-white/90 mt-1 font-semibold">
                Elegí tus 3 jerseys favoritos | Envío GRATIS | Hasta 10 días
              </p>
            </div>

            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Flame className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" fill="currentColor" />
            </motion.div>
          </div>

          {/* Right: CTA Button */}
          <Link href="#bestsellers" className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 md:px-8 py-3 md:py-4 bg-yellow-300 text-black font-black uppercase tracking-wide text-sm md:text-base rounded-full shadow-2xl border-2 border-black hover:bg-black hover:text-yellow-300 hover:border-yellow-300 transition-all duration-300"
            >
              ARMAR MI COMBO
            </motion.button>
          </Link>
        </div>

        {/* Bottom: Benefits (Desktop only) */}
        <div className="hidden lg:flex items-center justify-center gap-8 mt-4 text-white/90">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Tag className="w-4 h-4 text-yellow-300" />
            <span>3 Camisetas: ARS 32.900</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Truck className="w-4 h-4 text-yellow-300" />
            <span>Envío GRATIS incluido</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="w-4 h-4 text-yellow-300" />
            <span>Entrega hasta 10 días</span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
