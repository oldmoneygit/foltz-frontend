'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(product.price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden
                 transition-all duration-300 ease-out
                 hover:bg-black/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/50"
    >
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-zinc-900/50">
        {/* Badge Promocional - Top Left */}
        {product.badge && (
          <div className="absolute top-2 left-2 z-10 bg-brand-yellow text-black px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-xl">
            🔥 {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 backdrop-blur-md rounded-full
                     hover:bg-brand-navy transition-all opacity-80 hover:opacity-100"
        >
          <Heart
            size={18}
            className={`${isWishlisted ? 'fill-brand-yellow text-brand-yellow' : 'text-white'} transition-colors`}
          />
        </button>

        <Image
          src={product.main_image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={75}
          loading="lazy"
          unoptimized
        />
      </Link>

      {/* Content Area */}
      <div className="p-3 space-y-2 flex flex-col">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-white text-base leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Prices and Badge */}
        <div className="space-y-1.5 mt-auto">
          {/* Prices */}
          <p className="text-gray-400 line-through text-base">AR$ 115.798</p>
          <p className="text-brand-yellow font-bold text-xl">{formattedPrice}</p>

          {/* Badge COMPRA 1 LLEVA 2 - Compacto */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellow rounded-full">
            <span className="text-black text-[10px] md:text-xs font-black uppercase tracking-tight md:tracking-wide whitespace-nowrap">COMPRA 1 LLEVA 2</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const BestSellers = ({ products = [] }) => {
  // Show loading or fallback if no products
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section id="bestsellers" className="py-20 bg-gradient-to-b from-black via-zinc-950 to-black relative">
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-brand-yellow text-sm font-black uppercase tracking-[0.3em] mb-2 block">
            Lo Más Vendido
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            NUESTROS <span className="text-brand-yellow">BEST SELLERS</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Los jerseys favoritos de nuestros clientes. Autenticidad garantizada y envío rápido.
          </p>
        </motion.div>

        {/* Products Carousel */}
        <div className="relative px-12">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-gray-600',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-brand-yellow',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="!pb-12"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id || product.handle}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10
                           bg-brand-yellow text-brand-navy p-3 rounded-full
                           hover:bg-brand-navy hover:text-brand-yellow transition-colors duration-200
                           shadow-xl">
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10
                           bg-brand-yellow text-brand-navy p-3 rounded-full
                           hover:bg-brand-navy hover:text-brand-yellow transition-colors duration-200
                           shadow-xl">
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/collection/bestsellers"
            className="inline-block px-8 py-4 bg-brand-yellow text-brand-navy font-black uppercase tracking-wide text-sm rounded-full hover:bg-brand-navy hover:text-brand-yellow transition-colors duration-300"
          >
            Ver Todos los Best Sellers
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default BestSellers
