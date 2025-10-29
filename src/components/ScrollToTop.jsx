'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostra o botão quando o usuário rolar mais de 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-44 right-4 md:bottom-24 md:right-6 z-40 group"
          aria-label="Volver arriba"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-yellow/20 to-transparent rounded-full blur-xl group-hover:from-brand-yellow/30 transition-all duration-300" />

            {/* Button */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-t from-black via-zinc-900 to-zinc-800 border border-white/10 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:shadow-brand-yellow/20 transition-all duration-300">
              {/* Inner gradient border */}
              <div className="absolute inset-[1px] rounded-full bg-gradient-to-t from-black to-zinc-900" />

              {/* Arrow */}
              <motion.div
                className="relative z-10"
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowUp className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-brand-yellow transition-colors duration-300" />
              </motion.div>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
