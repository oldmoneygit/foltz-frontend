'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useStoreMode } from '@/contexts/StoreModeContext'
import { usePackFoltz } from '@/contexts/PackFoltzContext'

const PromotionalBanner = () => {
  const { isRetro } = useStoreMode()
  const { packSize, formatPrice, packPrice } = usePackFoltz()

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`w-full z-[60] border-b transition-colors duration-300
                 ${isRetro
                   ? 'bg-[#0D0C0A] border-[#D4AF37]/20'
                   : 'bg-black border-white/10'
                 }`}
    >
      <Link
        href={isRetro ? "/productos" : "/#bestsellers"}
        className="block w-full h-10 md:h-12 relative overflow-hidden group"
        aria-label={isRetro ? "Colección Retro Histórica" : `Pack Foltz: ${packSize} Camisetas por ${formatPrice(packPrice)}`}
      >
        <div className={`absolute inset-0 transition-all duration-300
                        ${isRetro
                          ? 'bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10'
                          : 'bg-white/5 group-hover:bg-white/10'
                        }`} />
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          {isRetro ? (
            <span className="text-[#D4AF37] font-bold text-[10px] md:text-sm uppercase tracking-wider md:tracking-widest whitespace-nowrap">
              ★ Colección Histórica • Camisetas Retro Legendarias ★
            </span>
          ) : (
            <span className="text-white/90 font-bold text-[10px] md:text-sm uppercase tracking-wider md:tracking-widest whitespace-nowrap">
              Pack Foltz: {packSize} Camisetas por {formatPrice(packPrice)} • Envío Gratis
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default PromotionalBanner
