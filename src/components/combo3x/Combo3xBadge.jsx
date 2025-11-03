'use client'

import { motion } from 'framer-motion'
import { Tag } from 'lucide-react'

export default function Combo3xBadge() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -12 }}
      animate={{ scale: 1, rotate: -3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="absolute top-2 left-2 z-10"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1.5 rounded-lg shadow-lg border-2 border-white/30"
      >
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          <span className="text-xs font-black uppercase tracking-wide">
            COMBO X3: ARS 32.900
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
