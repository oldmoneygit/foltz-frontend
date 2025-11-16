'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ProductCard = ({ product, index }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Formata o preço como "AR$ XX.XXX,XX"
  const formatPrice = (value) => {
    const formatted = value.toFixed(2).replace('.', ',')
    const parts = formatted.split(',')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `AR$ ${parts.join(',')}`
  }

  const formattedPrice = formatPrice(product.price || 35900)
  const formattedRegularPrice = product.regularPrice ? formatPrice(product.regularPrice) : null

  return (
    <Link href={`/product/${product.slug || product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-zinc-800 hover:border-brand-yellow/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full flex flex-col"
      >
        {/* Best Seller Badge - Top Left */}
        <div className="absolute top-2 left-2 z-10 bg-brand-yellow text-black px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-xl flex items-center gap-1">
          <TrendingUp size={12} />
          Best Seller
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsWishlisted(!isWishlisted)
          }}
          className="absolute top-2 right-2 z-10 p-2 bg-black/60 backdrop-blur-md rounded-full
                     hover:bg-brand-yellow transition-all"
        >
          <Heart
            size={18}
            className={`${isWishlisted ? 'fill-brand-yellow text-brand-yellow' : 'text-white'} transition-colors`}
          />
        </button>

        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {product.main_image ? (
            <Image
              src={product.main_image}
              alt={product.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading={index < 8 ? 'eager' : 'lazy'}
              quality={75}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              Sin imagen
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow space-y-2 items-center text-center">
          {/* Product Name */}
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-brand-yellow transition-colors min-h-[2.5rem] uppercase">
            {product.name}
          </h3>

          {/* Prices and Badge */}
          <div className="space-y-1.5 mt-auto flex flex-col items-center">
            {/* Prices */}
            <p className="text-gray-400 text-xs line-through">
              {formattedRegularPrice}
            </p>
            <p className="text-brand-yellow font-bold text-base">
              {formattedPrice}
            </p>

            {/* Badge COMPRA 1 LLEVA 3 - Compacto */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellow rounded-full">
              <span className="text-black text-[10px] md:text-xs font-black uppercase tracking-tight md:tracking-wide whitespace-nowrap">COMPRA 1 LLEVA 3</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function BestsellersContent({ products = [] }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <div className="pb-16">
          <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4 bg-brand-yellow/10 px-6 py-3 rounded-full">
            <TrendingUp className="text-brand-yellow" size={24} />
            <h2 className="text-brand-yellow text-xs md:text-sm font-black uppercase tracking-[0.3em]">
              Colección
            </h2>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white mb-6">
            <span className="text-brand-yellow">BEST SELLERS</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Los jerseys más vendidos de los equipos más famosos del mundo.
            <br className="hidden md:block" />
            Real Madrid, PSG, Barcelona, Manchester City y más.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div>
              <span className="text-4xl md:text-5xl font-black text-brand-yellow block">
                {products.length}
              </span>
              <span className="text-white text-sm uppercase tracking-wider">Productos</span>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div>
              <span className="text-4xl md:text-5xl font-black text-brand-yellow block">
                100%
              </span>
              <span className="text-white text-sm uppercase tracking-wider">Calidad</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-brand-yellow text-xl">●</span>
              <span>Calidad Premium 1:1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-yellow text-xl">●</span>
              <span>Envío rápido y seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-yellow text-xl">●</span>
              <span>Compra 1 Lleva 2</span>
            </div>
          </div>
        </motion.div>

        {/* Products Section */}
        <div id="productos">
          {products.length > 0 ? (
            <>
              {/* Product Counter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <p className="text-gray-400 text-sm">
                  Mostrando <span className="text-brand-yellow font-bold">1 - {products.length}</span> de{' '}
                  <span className="text-brand-yellow font-bold">{products.length}</span> productos
                </p>
              </motion.div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 text-xl py-12">
              No hay productos disponibles en este momento.
            </div>
          )}
        </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
