'use client'

import { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BestSellers = ({ products = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 4 },
        '(min-width: 1280px)': { slidesToScroll: 5 }
      }
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Show loading or fallback if no products
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section
      id="bestsellers"
      className="relative py-8 md:py-10 bg-black overflow-hidden transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        {/* Section Header - Estilo Retrobox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">
            Los más vendidos <span className="inline-block">🔥</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Las camisetas retrô más populares de nuestra colección
          </p>
        </motion.div>

        {/* Carousel - Estilo Retrobox */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id || product.handle}
                  className="flex-[0_0_calc(50%-12px)] min-w-0 md:flex-[0_0_48%] lg:flex-[0_0_24%] xl:flex-[0_0_19%]"
                >
                  <ProductCard product={product} index={index} showBlackNovemberBadge={true} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Estilo Retrobox */}
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm p-4 rounded-full z-10 transition-all duration-300 hover:scale-110 border border-white/20"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full z-10 transition-all duration-300 hover:scale-110 border border-white/20"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Ver Todos Button - Estilo Retrobox */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mt-6 md:mt-8"
        >
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white hover:bg-white/90 text-black font-black uppercase text-sm md:text-base rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/20"
          >
            Ver Todos Los Productos
            <ChevronRight size={20} className="md:hidden" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default BestSellers
