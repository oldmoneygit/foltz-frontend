'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from './ProductCard'

export default function FeaturedProducts({ products = [] }) {
  // Show nothing if no products
  if (!products || products.length === 0) {
    return null
  }

  const featuredProducts = products
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-brand-yellow text-xs md:text-sm font-black uppercase tracking-[0.3em] bg-brand-yellow/10 px-4 py-2 rounded-full border border-brand-yellow/30">
              ⭐ COLECCIÓN EXCLUSIVA
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase">
            Productos <span className="text-brand-yellow">Destacados</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto">
            Las camisetas más codiciadas del momento. Ediciones limitadas y colecciones exclusivas.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <Link href="/collection/featured">
            <button className="px-8 py-4 bg-brand-yellow text-black font-black uppercase tracking-wide text-sm rounded-full hover:bg-yellow-400 transition-colors duration-200 shadow-xl">
              VER TODOS LOS PRODUCTOS
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
