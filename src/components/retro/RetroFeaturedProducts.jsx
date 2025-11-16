'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function RetroFeaturedProducts({ products = [] }) {
  // Get random 4 products as "featured"
  const featuredProducts = products
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

  if (featuredProducts.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-zinc-950 to-black">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-brand-yellow/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="text-brand-yellow" size={20} />
            <span className="text-brand-yellow font-bold text-sm">DESTACADOS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Productos Destacados
          </h2>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
