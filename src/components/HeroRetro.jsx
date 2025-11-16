'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, Star } from 'lucide-react'

export default function HeroRetro() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0D0C0A]">
      {/* Vintage Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25px 25px, #D4AF37 2px, transparent 0),
              radial-gradient(circle at 75px 75px, #D4AF37 1px, transparent 0)
            `,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* Golden Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Decorative Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Star className="w-4 h-4 fill-[#D4AF37]" />
            <span className="text-sm font-semibold tracking-[0.3em] uppercase">
              Colección Histórica
            </span>
            <Star className="w-4 h-4 fill-[#D4AF37]" />
          </div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-[#F5F1E8] mb-6"
        >
          FOLTZ{' '}
          <span className="text-[#D4AF37] relative">
            RETRO
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#D4AF37]/50 rounded-full" />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#C4B8A0] text-lg md:text-xl max-w-2xl mx-auto mb-8"
        >
          Revive la gloria de los momentos históricos del fútbol con nuestras
          camisetas vintage de época. Cada pieza cuenta una historia legendaria.
        </motion.p>

        {/* Vintage Ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex justify-center items-center gap-4 mb-10"
        >
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <div className="text-[#D4AF37] text-2xl">⚽</div>
          <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            href="/productos"
            className="inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D0C0A] px-10 py-4 rounded-lg font-bold text-lg uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 group"
          >
            <Clock className="w-5 h-5" />
            <span>Explorar Colección</span>
          </Link>

          <p className="text-[#C4B8A0]/60 text-sm mt-4">
            Réplicas auténticas de camisetas históricas
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-[#D4AF37] mb-1">
              50+
            </div>
            <div className="text-[#C4B8A0] text-sm">Años de Historia</div>
          </div>
          <div className="text-center border-x border-[#D4AF37]/20">
            <div className="text-3xl md:text-4xl font-black text-[#D4AF37] mb-1">
              100+
            </div>
            <div className="text-[#C4B8A0] text-sm">Camisetas Retro</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-[#D4AF37] mb-1">
              1:1
            </div>
            <div className="text-[#C4B8A0] text-sm">Réplica Exacta</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
