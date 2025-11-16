'use client'

import { motion } from 'framer-motion'
import { Zap, Gift, Truck } from 'lucide-react'
import Link from 'next/link'

export default function RetroPromoBanner() {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-yellow via-yellow-400 to-amber-500"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
            }} />
          </div>

          <div className="relative p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left - Promo Info */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full mb-3">
                  <Zap className="text-black" size={16} />
                  <span className="text-black font-bold text-xs uppercase tracking-wider">
                    Oferta Especial
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-black mb-2">
                  PACK BLACK FRIDAY
                </h3>
                <p className="text-black/80 font-medium mb-4">
                  Llevá 4 camisetas al mejor precio
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 justify-center md:justify-start mb-4">
                  <span className="text-sm text-black/60 line-through">ARS 131.600</span>
                  <span className="text-4xl md:text-5xl font-black text-black">
                    ARS 59.900
                  </span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Gift className="text-black" size={18} />
                    <span className="text-black font-medium text-sm">4 Camisetas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="text-black" size={18} />
                    <span className="text-black font-medium text-sm">Envío Gratis</span>
                  </div>
                </div>
              </div>

              {/* Right - CTA */}
              <div className="flex flex-col items-center gap-3">
                <Link href="/pack-black">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-brand-yellow px-8 py-4 rounded-full font-black text-lg shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    ARMAR MI PACK
                  </motion.button>
                </Link>
                <span className="text-black/70 text-sm font-medium">
                  Ahorrá hasta 55%
                </span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  )
}
