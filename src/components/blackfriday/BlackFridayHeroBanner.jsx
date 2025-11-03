'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Package, CreditCard, Clock } from 'lucide-react'

export default function BlackFridayHeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 overflow-hidden"
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
                BLACK FRIDAY | PAGÁ AL RECIBIR
              </h2>
              <p className="text-xs md:text-sm lg:text-base text-white/90 mt-1 font-bold">
                Hasta 6 jerseys → Pagá solo <span className="text-yellow-300">ARS 8.000</span> de envío → Recibí en 10 días → Pagá el resto como quieras
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
              className="px-6 md:px-8 py-3 md:py-4 bg-black text-yellow-300 font-black uppercase tracking-wide text-sm md:text-base rounded-full shadow-2xl border-2 border-yellow-300 hover:bg-yellow-300 hover:text-black transition-all duration-300"
            >
              VER PROMOCIÓN
            </motion.button>
          </Link>
        </div>

        {/* Bottom: Benefits (Desktop only) */}
        <div className="hidden lg:flex items-center justify-center gap-8 mt-4 text-white/90">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-yellow-300" />
            <span>Hasta 6 jerseys</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-yellow-300" />
            <span>Todas las formas de pago</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-yellow-300" />
            <span>Entrega en 10 días</span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
