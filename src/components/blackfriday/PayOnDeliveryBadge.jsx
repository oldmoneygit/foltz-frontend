'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

export default function PayOnDeliveryBadge({ className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute top-2 left-2 z-10 ${className}`}
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg shadow-xl"
      >
        <Flame className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" fill="currentColor" />
        <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-tight whitespace-nowrap">
          Pague na Entrega
        </span>
      </motion.div>
    </motion.div>
  )
}
