'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Clock } from 'lucide-react'

export default function RetroContent({ products = [] }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-zinc-950 via-black to-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              {/* Left Side - Banner */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-5 relative rounded-2xl overflow-hidden"
              >
                <div className="relative h-[400px] lg:h-[600px]">
                  <Image
                    src="/images/leagues/retro.jpg"
                    alt="Retro Collection"
                    fill
                    className="object-cover"
                    priority
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
              </motion.div>

              {/* Right Side - Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-7 flex flex-col justify-center space-y-6"
              >
                <div>
                  <h2 className="text-brand-yellow text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-2">
                    COLECCIÓN
                  </h2>
                  <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-4">
                    RETRO COLLECTION
                  </h3>
                </div>

                {/* Product Count */}
                <div>
                  <span className="text-5xl md:text-6xl font-black text-brand-yellow">
                    {products.length}
                  </span>
                  <span className="text-white text-xl ml-2">productos</span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white">
                    <span className="text-brand-yellow text-xl">●</span>
                    <span>Camisetas vintage de los 70s-2000s</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="text-brand-yellow text-xl">●</span>
                    <span>Ediciones clásicas y nostálgicas</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="text-brand-yellow text-xl">●</span>
                    <span className="flex items-center gap-2">
                      Calidad Premium 1:1
                    </span>
                  </li>
                </ul>

                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/30 rounded-full w-fit">
                  <Clock className="text-brand-yellow" size={20} />
                  <span className="text-brand-yellow text-sm font-bold">
                    Ediciones Limitadas
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 bg-black">
          <div className="container mx-auto px-4 md:px-6">
            {products.length > 0 ? (
              <>
                {/* Product Counter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8"
                >
                  <p className="text-gray-400 text-sm">
                    Mostrando <span className="text-brand-yellow font-bold">1 - {products.length}</span> de{' '}
                    <span className="text-brand-yellow font-bold">{products.length}</span> productos
                  </p>
                </motion.div>

                {/* Products Grid - 2 columns mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 text-xl py-12">
                Pronto tendremos productos retro en esta colección!
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}



