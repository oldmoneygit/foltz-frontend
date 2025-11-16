'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from './ProductCard'

export default function CollectionGridClient({ collectionSlug, collectionImage, products = [] }) {
  // Don't render if no products
  if (!products || products.length === 0) {
    return null
  }

  // Map slugs to image filenames
  const imageMap = {
    'premier-league': 'premier league.jpg',
    'la-liga': 'la liga.jpg',
    'serie-a': 'serie A.jpg',
    'bundesliga': 'bundesliga.jpg',
    'ligue-1': 'Ligue 1.jpg',
    'national-teams': 'national teams.jpg',
    'argentina-legends': 'argentina legends.jpg',
  }

  const imagePath = `/images/collections/${imageMap[collectionSlug] || collectionImage}`

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Desktop Layout: Image Left + Products Grid Right */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 xl:gap-8">
          {/* League Image - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-3 xl:col-span-3"
          >
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
                <Image
                  src={imagePath}
                  alt={collectionSlug}
                  fill
                  className="object-contain rounded-2xl"
                  sizes="(max-width: 1280px) 25vw, 20vw"
                  priority
                />
              </div>
              {/* View All Link Below Image */}
              <Link href={`/liga/${collectionSlug}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 px-6 py-3 bg-transparent border-2 border-brand-yellow text-brand-yellow font-black uppercase tracking-wide text-sm rounded-full hover:bg-brand-yellow hover:text-black transition-all duration-300"
                >
                  Ver Toda la Colección
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Products Grid - Right Side (4 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-9 xl:col-span-9"
          >
            <div className="grid grid-cols-4 gap-4 xl:gap-6">
              {products.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} index={index} showBlackNovemberBadge={true} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile/Tablet Layout: Image on Top + Products Grid Below */}
        <div className="lg:hidden">
          {/* League Image - Top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
              <Image
                src={imagePath}
                alt={collectionSlug}
                fill
                className="object-contain rounded-2xl"
                sizes="(max-width: 768px) 100vw, 90vw"
                priority
              />
            </div>
          </motion.div>

          {/* Products Grid - 2 columns on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {products.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={product} index={index} showBlackNovemberBadge={true} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* View All Button - Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href={`/liga/${collectionSlug}`}>
              <button className="px-6 py-3 bg-transparent border-2 border-brand-yellow text-brand-yellow font-black uppercase tracking-wide text-sm rounded-full hover:bg-brand-yellow hover:text-black transition-all duration-300">
                Ver Toda la Colección
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
