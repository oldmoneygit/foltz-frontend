'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Truck, Tag, Clock } from 'lucide-react'

export default function Combo3xHeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full bg-gradient-to-b from-zinc-900 to-black border-b border-white/5"
    >
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Main Message */}
          <div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-3">
              Combo 3 Camisetas
            </h2>
            <p className="text-3xl md:text-5xl lg:text-6xl text-white/90 font-black">
              ARS 32.900
            </p>
            <p className="text-sm md:text-base text-white/60 mt-4 font-medium">
              Elegí tus 3 jerseys favoritos — Envío incluido
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/70">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Tag className="w-4 h-4" />
              <span>3 x ARS 32.900</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Truck className="w-4 h-4" />
              <span>Envío Gratis</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Clock className="w-4 h-4" />
              <span>Hasta 10 días</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="#bestsellers">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider text-sm rounded-full hover:bg-gray-200 transition-all duration-300 shadow-lg"
            >
              Armar Mi Combo
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
