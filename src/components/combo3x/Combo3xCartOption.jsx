'use client'

import { motion } from 'framer-motion'
import { Tag, Flame, Check, Truck, Clock } from 'lucide-react'
import { useCombo3x } from '@/contexts/Combo3xContext'

export default function Combo3xCartOption({ items, subtotal }) {
  const { calculateCombo3xTotals, COMBO_PRICE } = useCombo3x()

  if (!items || items.length === 0) {
    return null
  }

  const comboData = calculateCombo3xTotals(items)

  // Formatar preço
  const formatPrice = (value) => {
    const formatted = value.toFixed(2).replace('.', ',')
    const parts = formatted.split(',')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `AR$ ${parts.join(',')}`
  }

  // Se tiver menos de 3 produtos, mostrar incentivo
  if (!comboData.hasCombo) {
    const productsNeeded = comboData.productsNeeded || (3 - comboData.itemCount)

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-900/30 to-red-950/30 border-2 border-orange-500/30 rounded-2xl p-4 md:p-5"
      >
        <div className="flex items-start gap-3">
          <Flame className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-white font-black text-base md:text-lg mb-1">
              🔥 COMBO BLACK FRIDAY
            </h3>
            <p className="text-orange-400 font-bold text-lg mb-2">
              3 CAMISETAS: ARS 32.900
            </p>
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-orange-300 text-sm font-bold">
                ¡Agregá {productsNeeded} {productsNeeded === 1 ? 'camiseta más' : 'camisetas más'} y activá esta promoción!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Se tiver 3+ produtos, mostrar detalhes do combo
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-900/30 to-emerald-950/30 border-2 border-green-500/50 rounded-2xl p-4 md:p-6"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-6 h-6 text-white" strokeWidth={3} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-green-400" fill="currentColor" />
            <h3 className="text-green-400 font-black text-base md:text-lg uppercase">
              COMBO ACTIVADO
            </h3>
          </div>
          <p className="text-white/80 text-sm">
            {comboData.fullCombos === 1 ? '¡Estás aprovechando la promoción!' : `¡Tienes ${comboData.fullCombos} combos activos!`}
          </p>
        </div>
      </div>

      {/* Detalles do combo */}
      <div className="space-y-3 bg-black/30 rounded-xl p-4 mb-4">
        {/* Combos completos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-semibold">
              {comboData.fullCombos} {comboData.fullCombos === 1 ? 'Combo' : 'Combos'} (3 camisetas c/u)
            </span>
          </div>
          <span className="text-green-400 font-bold">
            {formatPrice(comboData.fullCombos * COMBO_PRICE)}
          </span>
        </div>

        {/* Items restantes (se houver) */}
        {comboData.remainingItems > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">
                {comboData.remainingItems} {comboData.remainingItems === 1 ? 'camiseta adicional' : 'camisetas adicionales'}
              </span>
            </div>
            <span className="text-white/80 text-sm font-semibold">
              Precio normal
            </span>
          </div>
        )}

        {/* Economia */}
        {comboData.savings > 0 && (
          <div className="flex items-center justify-between pt-3 border-t-2 border-green-500/30">
            <span className="text-green-400 font-bold text-sm">
              💰 Ahorro total:
            </span>
            <span className="text-green-400 font-black text-lg">
              {formatPrice(comboData.savings)}
            </span>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
          <Truck className="w-4 h-4 text-green-400" />
          <span className="text-xs text-white/80">Envío gratis</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
          <Clock className="w-4 h-4 text-green-400" />
          <span className="text-xs text-white/80">Hasta 10 días</span>
        </div>
      </div>
    </motion.div>
  )
}
