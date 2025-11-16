'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TeamPageContent({ team, products, slug }) {
  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section - Estilo Retrobox */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-yellow/10 via-transparent to-transparent opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-brand-yellow transition-colors duration-300 text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Volver al inicio
            </Link>
          </motion.div>

          {/* Team Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-6 md:gap-10"
          >
            {/* Team Logo/Shield */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 relative">
                {team.logo ? (
                  <Image
                    src={team.logo}
                    alt={team.name}
                    fill
                    className="object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                    priority
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <Shield size={60} className="text-white/50" />
                  </div>
                )}
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-brand-yellow/20 blur-2xl -z-10" />
            </div>

            {/* Team Info */}
            <div className="text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3"
              >
                {team.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-white/70 mb-4"
              >
                {team.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center md:justify-start gap-4"
              >
                <span className="px-4 py-2 bg-brand-yellow/20 text-brand-yellow rounded-lg text-sm font-bold border border-brand-yellow/30">
                  {team.league}
                </span>
                <span className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-semibold border border-white/20">
                  {products.length} {products.length === 1 ? 'producto' : 'productos'}
                </span>
              </motion.div>
            </div>
          </motion.div>
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
                Camisetas de {team.name}
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
                <Shield size={40} className="text-white/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No hay productos disponibles
              </h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Actualmente no tenemos camisetas de {team.name} en stock. Vuelve pronto para ver nuevas incorporaciones.
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

      {/* Related Teams Section */}
      <section className="py-12 bg-black/50 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-white mb-6">
            Explora otros equipos
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Boca Juniors', slug: 'boca-juniors' },
              { name: 'River Plate', slug: 'river-plate' },
              { name: 'Real Madrid', slug: 'real-madrid' },
              { name: 'Barcelona', slug: 'barcelona' },
              { name: 'Manchester United', slug: 'manchester-united' },
              { name: 'PSG', slug: 'psg' },
              { name: 'AC Milan', slug: 'ac-milan' },
              { name: 'Argentina', slug: 'seleccion-argentina' }
            ]
              .filter(t => t.slug !== slug)
              .slice(0, 6)
              .map(otherTeam => (
                <Link
                  key={otherTeam.slug}
                  href={`/equipo/${otherTeam.slug}`}
                  className="px-4 py-2 bg-white/10 hover:bg-brand-yellow/20 text-white hover:text-brand-yellow rounded-lg text-sm font-medium transition-all duration-300 border border-white/20 hover:border-brand-yellow/50"
                >
                  {otherTeam.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
