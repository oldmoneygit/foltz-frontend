'use client'

import { motion } from 'framer-motion'

/**
 * Black November Badge Component
 * Shows a promotional badge that adapts colors based on the theme/context
 *
 * @param {Object} props
 * @param {string} props.variant - 'retro' for vintage colors, 'modern' for current theme
 * @param {string} props.size - 'sm', 'md', 'lg' for different sizes
 * @param {string} props.className - Additional CSS classes
 */
export default function BlackNovemberBadge({
  variant = 'modern',
  size = 'md',
  className = '',
  showDiscount = true
}) {
  // Color schemes based on variant
  const colorSchemes = {
    retro: {
      bg: 'bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B8860B]',
      text: 'text-black',
      border: 'border-[#F5F1E8]/30',
      glow: 'shadow-[0_0_20px_rgba(212,175,55,0.4)]',
      badge: 'bg-black text-[#D4AF37]'
    },
    modern: {
      bg: 'bg-gradient-to-r from-brand-yellow via-yellow-400 to-yellow-500',
      text: 'text-black',
      border: 'border-brand-yellow/30',
      glow: 'shadow-[0_0_20px_rgba(250,204,21,0.4)]',
      badge: 'bg-black text-brand-yellow'
    }
  }

  // Size configurations
  const sizes = {
    sm: {
      container: 'px-2 py-1',
      text: 'text-[10px]',
      discount: 'text-xs'
    },
    md: {
      container: 'px-3 py-1.5',
      text: 'text-xs',
      discount: 'text-sm'
    },
    lg: {
      container: 'px-4 py-2',
      text: 'text-sm',
      discount: 'text-base'
    }
  }

  const colors = colorSchemes[variant] || colorSchemes.modern
  const sizeConfig = sizes[size] || sizes.md

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-1.5 ${sizeConfig.container} ${colors.bg} ${colors.text} ${colors.border} border rounded-full font-black uppercase tracking-wide ${colors.glow} ${className}`}
    >
      <span className={sizeConfig.text}>BLACK NOVEMBER</span>
      {showDiscount && (
        <span className={`${colors.badge} ${sizeConfig.discount} px-1.5 py-0.5 rounded font-black`}>
          -50%
        </span>
      )}
    </motion.div>
  )
}

/**
 * Ribbon version for product cards
 */
export function BlackNovemberRibbon({ variant = 'modern', className = '' }) {
  const colorSchemes = {
    retro: {
      bg: 'bg-[#D4AF37]',
      text: 'text-black'
    },
    modern: {
      bg: 'bg-brand-yellow',
      text: 'text-black'
    }
  }

  const colors = colorSchemes[variant] || colorSchemes.modern

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`absolute top-3 left-0 z-20 ${className}`}
    >
      <div className={`${colors.bg} ${colors.text} px-3 py-1 font-black text-[10px] tracking-wider uppercase shadow-lg`}>
        BLACK NOVEMBER
      </div>
      {/* Triangle shadow effect */}
      <div
        className="absolute top-full left-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[6px] border-t-black/50"
      />
    </motion.div>
  )
}

/**
 * Corner badge for product cards
 */
export function BlackNovemberCorner({ variant = 'modern', discount = '-50%' }) {
  const colorSchemes = {
    retro: {
      bg: 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B]',
      text: 'text-black'
    },
    modern: {
      bg: 'bg-gradient-to-br from-brand-yellow to-yellow-500',
      text: 'text-black'
    }
  }

  const colors = colorSchemes[variant] || colorSchemes.modern

  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      className="absolute -top-1 -right-1 z-20"
    >
      <div className={`${colors.bg} ${colors.text} w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg transform rotate-12`}>
        <span className="text-[8px] font-black leading-none">BLACK</span>
        <span className="text-[8px] font-black leading-none">NOV</span>
        <span className="text-sm font-black leading-none">{discount}</span>
      </div>
    </motion.div>
  )
}
