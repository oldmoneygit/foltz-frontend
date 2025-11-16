'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

const TEAM_CONFIGS = {
  'boca-juniors': {
    name: 'BOCA JUNIORS',
    logo: '/images/collections/boca-juniors-logo.png',
    primaryColor: '#0033a0',
    secondaryColor: '#ffd700',
    textColor: 'text-yellow-400',
    bgGradient: 'from-blue-900/30 via-blue-900/10 to-transparent',
    borderColor: 'border-yellow-500/30',
    hoverBorder: 'hover:border-yellow-500/60',
  },
  'river-plate': {
    name: 'RIVER PLATE',
    logo: '/images/collections/river-plate-logo.png',
    primaryColor: '#c8102e',
    secondaryColor: '#ffffff',
    textColor: 'text-red-500',
    bgGradient: 'from-red-900/30 via-red-900/10 to-transparent',
    borderColor: 'border-red-500/30',
    hoverBorder: 'hover:border-red-500/60',
  },
  'argentina': {
    name: 'SELECCIÓN ARGENTINA',
    logo: '/images/collections/argentina-logo.png',
    primaryColor: '#75aadb',
    secondaryColor: '#ffffff',
    textColor: 'text-sky-400',
    bgGradient: 'from-sky-900/30 via-sky-900/10 to-transparent',
    borderColor: 'border-sky-500/30',
    hoverBorder: 'hover:border-sky-500/60',
  }
}

export default function RetroTeamSection({ team, products = [] }) {
  const config = TEAM_CONFIGS[team] || TEAM_CONFIGS['boca-juniors']

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4500, stopOnInteraction: true })]
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

  // Filter products by team name
  const teamProducts = products.filter(p => {
    const title = (p.title || p.name || '').toLowerCase()
    return title.includes(config.name.toLowerCase().split(' ')[0].toLowerCase())
  }).slice(0, 8)

  if (teamProducts.length === 0) return null

  return (
    <section className={`py-12 md:py-16 bg-gradient-to-r ${config.bgGradient} border-y ${config.borderColor}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src={config.logo}
                alt={config.name}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
            <h2 className={`text-2xl md:text-3xl font-black ${config.textColor}`}>
              {config.name}
            </h2>
          </div>
          <Link
            href={`/buscar?q=${encodeURIComponent(config.name.split(' ')[0])}`}
            className={`flex items-center gap-2 ${config.textColor} font-bold hover:underline`}
          >
            Ver todos <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {teamProducts.map((product) => (
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
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-zinc-800 ${config.textColor} p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors z-10 hidden md:block`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-zinc-800 ${config.textColor} p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors z-10 hidden md:block`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}
