'use client'

import { motion } from 'framer-motion'
import { Check, Tag, Truck, Clock, Shield } from 'lucide-react'

export default function Combo3xProductCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-2xl p-4 md:p-6 my-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
          <Tag className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-black text-white uppercase">
            🔥 BLACK FRIDAY FOLTZ
          </h3>
          <p className="text-yellow-400 font-bold text-sm md:text-base">
            COMBO 3 CAMISETAS
          </p>
        </div>
      </div>

      {/* Precio destacado */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 mb-5">
        <p className="text-white/80 text-sm mb-1">Precio combo:</p>
        <p className="text-yellow-400 text-2xl md:text-3xl font-black">
          ARS 32.900
        </p>
        <p className="text-white/60 text-xs mt-1">Envío GRATIS incluido</p>
      </div>

      {/* Como funciona */}
      <div className="space-y-3 mb-5">
        <p className="text-white font-bold mb-2">Cómo funciona:</p>

        <div className="flex items-start gap-2 text-sm text-white/90">
          <span className="flex items-center justify-center w-5 h-5 bg-yellow-500 text-black rounded-full font-black text-xs shrink-0">
            1
          </span>
          <p>Agregá 3 camisetas al carrito (cualquier equipo)</p>
        </div>

        <div className="flex items-start gap-2 text-sm text-white/90">
          <span className="flex items-center justify-center w-5 h-5 bg-yellow-500 text-black rounded-full font-black text-xs shrink-0">
            2
          </span>
          <p>El descuento se aplica{' '}
            <span className="text-yellow-400 font-bold">automáticamente</span>
          </p>
        </div>

        <div className="flex items-start gap-2 text-sm text-white/90">
          <span className="flex items-center justify-center w-5 h-5 bg-yellow-500 text-black rounded-full font-black text-xs shrink-0">
            3
          </span>
          <p>Recibí en hasta{' '}
            <span className="text-yellow-400 font-bold">10 días hábiles</span>
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          <span>Envío GRATIS</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Tag className="w-4 h-4 text-orange-400" />
          <span>Precio fijo</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Hasta 10 días</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>100% seguro</span>
        </div>
      </div>

      {/* FAQ rápido */}
      <div className="space-y-2 bg-black/30 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/70">
            <strong className="text-white">¿Puedo mezclar equipos?</strong> Sí, elegí cualquier 3 camisetas
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/70">
            <strong className="text-white">¿Si quiero 6?</strong> Son 2 combos (ARS 65.800 total)
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/70">
            <strong className="text-white">¿Hay límite?</strong> No, comprá cuantos combos quieras
          </p>
        </div>
      </div>
    </motion.div>
  )
}
