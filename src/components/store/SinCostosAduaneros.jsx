'use client'

import { motion } from 'framer-motion'
import { BadgeCheck, Check } from 'lucide-react'

const SinCostosAduaneros = () => {
  return (
    <div className="dark:bg-gradient-to-br dark:from-green-900/30 dark:to-green-950/20 dark:border-green-500/30 bg-gradient-to-br from-green-50 to-green-100 border-t-4 border-green-500 py-8 md:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="dark:bg-green-500/10 dark:border-green-500/20 bg-white/80 border-2 border-green-500/30 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            {/* Header with Icon */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <BadgeCheck className="w-8 h-8 md:w-10 md:h-10 text-green-600 dark:text-green-400" />
              <h3 className="text-green-800 dark:text-green-300 font-black text-2xl md:text-3xl uppercase tracking-wide text-center">
                ¡Sin Costos Aduaneros!
              </h3>
              <BadgeCheck className="w-8 h-8 md:w-10 md:h-10 text-green-600 dark:text-green-400" />
            </div>

            {/* Main Message */}
            <div className="text-center mb-6">
              <p className="text-green-900 dark:text-green-100 text-lg md:text-xl font-bold mb-3">
                Nosotros nos hacemos cargo de TODOS los trámites aduaneros
              </p>
              <p className="text-green-800 dark:text-green-200 text-base md:text-lg leading-relaxed">
                <strong className="font-black">Solo pagas el precio de la camiseta.</strong> Nos encargamos de{' '}
                <span className="font-bold underline decoration-green-500">todos los impuestos, tributos y costos de importación</span>.{' '}
                Sin sorpresas, sin costos adicionales al recibir tu pedido.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 dark:bg-green-500/5 dark:border-green-500/20 bg-green-50 border border-green-200 rounded-xl">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-900 dark:text-green-100 font-bold text-sm mb-1">Sin Impuestos</p>
                  <p className="text-green-800 dark:text-green-200 text-xs">Cubrimos todos los tributos aduaneros</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 dark:bg-green-500/5 dark:border-green-500/20 bg-green-50 border border-green-200 rounded-xl">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-900 dark:text-green-100 font-bold text-sm mb-1">Sin Trámites</p>
                  <p className="text-green-800 dark:text-green-200 text-xs">Gestionamos todo el proceso de importación</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 dark:bg-green-500/5 dark:border-green-500/20 bg-green-50 border border-green-200 rounded-xl">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-900 dark:text-green-100 font-bold text-sm mb-1">Sin Sorpresas</p>
                  <p className="text-green-800 dark:text-green-200 text-xs">El precio final es el que ves en el carrito</p>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-6 pt-6 border-t-2 border-green-500/30">
              <p className="text-center text-green-800 dark:text-green-200 text-sm">
                <strong className="font-black">100% Transparente:</strong> El precio que ves incluye{' '}
                <span className="font-bold">TODO</span>. Recibís tu pedido sin ningún cargo extra en la puerta de tu casa.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SinCostosAduaneros
