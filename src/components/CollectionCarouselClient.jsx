'use client'

import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from './ProductCard'

export default function CollectionCarousel({ title, emoji, subtitle, collectionSlug, products = [] }) {
  // Don't render if no products
  if (!products || products.length === 0) {
    return null
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-block mb-4">
            <span className="text-4xl md:text-5xl mb-4 block">{emoji}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3 uppercase">
            {title}
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-[0_0_calc(100%-20px)] min-w-0 sm:flex-[0_0_calc(50%-16px)] md:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_23%]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20
                     bg-black/80 hover:bg-brand-yellow border border-zinc-800 hover:border-brand-yellow
                     text-white group-hover:text-black p-3 md:p-4 rounded-full
                     transition-all duration-300 shadow-xl
                     hidden md:flex items-center justify-center group"
            aria-label="Previous"
          >
            <ChevronLeft size={24} strokeWidth={3} className="group-hover:text-black" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20
                     bg-black/80 hover:bg-brand-yellow border border-zinc-800 hover:border-brand-yellow
                     text-white group-hover:text-black p-3 md:p-4 rounded-full
                     transition-all duration-300 shadow-xl
                     hidden md:flex items-center justify-center group"
            aria-label="Next"
          >
            <ChevronRight size={24} strokeWidth={3} className="group-hover:text-black" />
          </button>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12"
        >
          <Link href={`/liga/${collectionSlug}`}>
            <button className="px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-brand-yellow text-brand-yellow font-black uppercase tracking-wide text-sm rounded-full hover:bg-brand-yellow hover:text-black transition-all duration-300">
              Ver Toda la Colección
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
