'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function RetroBestSellers({ products = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  // Get first 8 products as "best sellers"
  const bestSellers = products.slice(0, 8)

  if (bestSellers.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-brand-yellow/10 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="text-brand-yellow" size={20} />
            <span className="text-brand-yellow font-bold text-sm">TOP VENTAS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            LOS MÁS VENDIDOS
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {bestSellers.map((product) => (
                <div
                  key={product.id}
                  className="flex-none w-[48%] sm:w-[45%] md:w-[32%] lg:w-[24%]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-brand-yellow text-black p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors z-10 hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-brand-yellow text-black p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors z-10 hidden md:block"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}
