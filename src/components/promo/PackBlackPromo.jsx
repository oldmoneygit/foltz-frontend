'use client'

import { motion } from 'framer-motion'
import { Flame, Zap, ShoppingCart, Lock, CheckCircle, Package, ShieldCheck } from 'lucide-react'
import { useBlackFriday } from '@/contexts/BlackFridayContext'

export default function PackBlackPromo() {
  const { packsRemaining, PACK_BLACK_PRICE, PACK_BLACK_SIZE, DAILY_PACK_LIMIT } = useBlackFriday()

  const percentageSold = Math.round(((DAILY_PACK_LIMIT - packsRemaining) / DAILY_PACK_LIMIT) * 100)
  const pricePerItem = Math.round(PACK_BLACK_PRICE / PACK_BLACK_SIZE)

  return (
    <section className="relative py-6 md:py-8 bg-black overflow-hidden border-t border-white/5">
      {/* Background Effects - Minimal and Monochromatic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.03),transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Promo Card - Simplified Design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-black rounded-3xl md:rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-2xl border border-white/20">
            {/* Urgency Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 md:px-6 py-2 bg-white text-black font-black text-xs md:text-sm rounded-full shadow-xl z-10 border-2 border-white/20">
              ⚡ SOLO {packsRemaining} PACKS HOY
            </div>

            {/* Content - Simplified Layout */}
            <div className="mt-3 md:mt-4">
              {/* Price Section - Compact and Objective */}
              <div className="text-center mb-4 md:mb-5">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <p className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none">
                    ARS ${PACK_BLACK_PRICE.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm md:text-base">
                  <span className="text-white/90 font-semibold">
                    {PACK_BLACK_SIZE} Camisetas
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/70 font-bold">
                    ${pricePerItem.toLocaleString()}/cada
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60 font-medium">
                    Envío Gratis
                  </span>
                </div>
              </div>

              {/* Benefits - Compact Horizontal Layout */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-4 md:mb-5">
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Flame className="w-4 h-4 text-white shrink-0" />
                  <span className="text-white/90 font-medium">15 packs/día</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Zap className="w-4 h-4 text-white shrink-0" />
                  <span className="text-white/90 font-medium">Precio insuperable</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <ShoppingCart className="w-4 h-4 text-white shrink-0" />
                  <span className="text-white/90 font-medium">Envío gratis</span>
                </div>
              </div>

              {/* Progress Bar - Compact */}
              <div className="p-3 md:p-4 bg-black/60 rounded-xl border border-white/10">
                <div className="flex justify-between items-center text-xs md:text-sm mb-1.5">
                  <span className="text-white/70 font-medium">Packs vendidos</span>
                  <span className="text-white font-bold text-sm md:text-base">{percentageSold}%</span>
                </div>
                <div className="w-full h-2 md:h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentageSold}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className="text-white/50 text-xs mt-1.5 text-center">
                  {DAILY_PACK_LIMIT - packsRemaining}/{DAILY_PACK_LIMIT} packs
                </p>
              </div>

              {/* Bottom Note - Compact */}
              <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-white/10 text-center">
                <p className="text-white/60 text-xs md:text-sm">
                  ✓ Descuento automático con {PACK_BLACK_SIZE} productos
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mt-6 md:mt-8"
        >
          {[
            { Icon: Lock, text: 'Pago Seguro' },
            { Icon: CheckCircle, text: 'Calidad 1:1' },
            { Icon: Package, text: 'Envío Gratis' },
            { Icon: ShieldCheck, text: '100% Garantizado' }
          ].map((item, idx) => {
            const IconComponent = item.Icon
            return (
              <div
                key={idx}
                className="p-4 md:p-5 bg-white/5 rounded-xl border border-white/10 text-center hover:bg-white/10 transition-colors flex flex-col items-center justify-center"
              >
                <IconComponent className="w-6 h-6 md:w-7 md:h-7 mb-2 text-white" strokeWidth={2} />
                <p className="text-white text-sm md:text-base font-bold">{item.text}</p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
