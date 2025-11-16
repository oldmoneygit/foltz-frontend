'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trophy } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function LeagueContent({ league, products, slug }) {
  return (
    <div className="min-h-screen bg-black">

      {/* Hero Section - Estilo Moderno y Organizado */}
      <section className="relative py-10 md:py-16 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" />

        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/ligas"
              className="inline-flex items-center gap-2 text-white/60 hover:text-brand-yellow transition-colors duration-300 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Volver a Ligas
            </Link>
          </motion.div>

          {/* Main Hero Content - Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left: League Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 order-2 lg:order-1"
            >
              {/* Collection Label */}
              <div className="mb-4">
                <span className="text-brand-yellow text-xs font-black uppercase tracking-[0.3em]">
                  COLECCIÓN
                </span>
              </div>

              {/* League Name */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.9] uppercase">
                {league.name}
              </h1>

              {/* Product Count */}
              <div className="mb-8">
                <span className="text-brand-yellow text-5xl md:text-6xl font-black">{products.length}</span>
                <span className="text-white/70 text-lg ml-2">productos disponibles</span>
              </div>

              {/* Country Badge with Flag Image */}
              <div className="inline-flex items-center gap-4">
                <div className="w-12 h-8 relative overflow-hidden rounded shadow-lg">
                  <Image
                    src={`https://flagcdn.com/w80/${league.flagCode || 'un'}.png`}
                    alt={league.country}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">País</p>
                  <p className="text-white font-bold text-lg">{league.country}</p>
                </div>
              </div>
            </motion.div>

            {/* Right: League Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 order-1 lg:order-2 flex justify-center"
            >
              <div className="relative">
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 relative">
                  {league.logo ? (
                    <Image
                      src={league.logo}
                      alt={league.name}
                      fill
                      className="object-contain drop-shadow-[0_0_60px_rgba(212,175,55,0.4)]"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border-2 border-brand-yellow/30">
                      <Trophy size={80} className="text-brand-yellow/60" />
                    </div>
                  )}
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-brand-yellow/10 blur-[100px] -z-10 rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-12 md:py-16 bg-black">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold text-white mb-8"
              >
                Camisetas de {league.name}
              </motion.h2>

              {/* Products Grid - Estilo Retrobox */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <Trophy size={40} className="text-white/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No hay productos disponibles
              </h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Actualmente no tenemos camisetas de {league.name} en stock. Vuelve pronto para ver nuevas incorporaciones.
              </p>
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow hover:bg-brand-yellow/90 text-black font-bold rounded-lg transition-all duration-300 hover:scale-105"
              >
                Ver todas las camisetas
                <ArrowLeft size={18} className="rotate-180" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Related Leagues Section */}
      <section className="py-12 bg-black/50 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-white mb-6">
            Explora otras ligas
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Premier League', slug: 'premier-league' },
              { name: 'La Liga', slug: 'la-liga' },
              { name: 'Serie A', slug: 'serie-a' },
              { name: 'Bundesliga', slug: 'bundesliga' },
              { name: 'Ligue 1', slug: 'ligue-1' },
              { name: 'Argentina Legends', slug: 'argentina-legends' },
              { name: 'Selecciones', slug: 'national-teams' },
              { name: 'MLS', slug: 'mls' }
            ]
              .filter(l => l.slug !== slug)
              .slice(0, 6)
              .map(otherLeague => (
                <Link
                  key={otherLeague.slug}
                  href={`/liga/${otherLeague.slug}`}
                  className="px-4 py-2 bg-white/10 hover:bg-brand-yellow/20 text-white hover:text-brand-yellow rounded-lg text-sm font-medium transition-all duration-300 border border-white/20 hover:border-brand-yellow/50"
                >
                  {otherLeague.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
