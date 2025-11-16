'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const COLLECTIONS = {
  argentina: {
    title: 'Clubes Argentinos',
    teams: [
      { name: 'Boca Juniors', logo: '/images/collections/boca-juniors-logo.png', slug: 'boca-juniors' },
      { name: 'River Plate', logo: '/images/collections/river-plate-logo.png', slug: 'river-plate' },
      { name: 'Racing Club', logo: '/images/collections/racing-club.png', slug: 'racing-club' },
      { name: 'Independiente', logo: '/images/collections/Independiente.png', slug: 'independiente' },
      { name: 'San Lorenzo', logo: '/images/collections/San-Lorenzo.png', slug: 'san-lorenzo' },
      { name: "Newell's Old Boys", logo: "/images/collections/Newell's_Old_Boys.png", slug: 'newells' },
      { name: 'Rosario Central', logo: '/images/collections/Rosário-Central.png', slug: 'rosario-central' },
    ]
  },
  europa: {
    title: 'Clubes Europeos',
    teams: [
      { name: 'Real Madrid', logo: '/images/collections/Real_Madrid.png', slug: 'real-madrid' },
      { name: 'Barcelona', logo: '/images/collections/FCBarcelona.svg.png', slug: 'barcelona' },
      { name: 'Manchester United', logo: '/images/collections/Manchester_United_FC.png', slug: 'manchester-united' },
      { name: 'Manchester City', logo: '/images/collections/Manchester_City.png', slug: 'manchester-city' },
      { name: 'Liverpool', logo: '/images/collections/liverpool.png', slug: 'liverpool' },
      { name: 'Chelsea', logo: '/images/collections/Chelsea.png', slug: 'chelsea' },
      { name: 'Arsenal', logo: '/images/collections/Arsenal.png', slug: 'arsenal' },
      { name: 'AC Milan', logo: '/images/collections/milan.png', slug: 'ac-milan' },
      { name: 'PSG', logo: '/images/collections/PSG.png', slug: 'psg' },
      { name: 'Inter Miami', logo: '/images/collections/Inter-miami.png', slug: 'inter-miami' },
    ]
  },
  ligas: {
    title: 'Por Competición',
    teams: [
      { name: 'Champions League', logo: '/images/champions league.jpeg', slug: 'champions-league' },
      { name: 'Copa Libertadores', logo: '/images/libertadores.jpeg', slug: 'libertadores' },
    ]
  },
  seleccion: {
    title: 'Selecciones',
    teams: [
      { name: 'Argentina', logo: '/images/collections/argentina-logo.png', slug: 'argentina' },
    ]
  }
}

const TABS = [
  { id: 'argentina', label: 'Argentina' },
  { id: 'europa', label: 'Europa' },
  { id: 'ligas', label: 'Ligas' },
  { id: 'seleccion', label: 'Selección' },
]

export default function RetroNuestrasColecciones() {
  const [activeTab, setActiveTab] = useState('argentina')
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 },
      }
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
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

  const currentCollection = COLLECTIONS[activeTab]

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
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            NUESTRAS COLECCIONES
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Explora las camisetas retro por equipo
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-zinc-900/50 rounded-full p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-brand-yellow text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                  {currentCollection.teams.map((team) => (
                    <div
                      key={team.slug}
                      className="flex-none w-[45%] sm:w-[30%] md:w-[25%] lg:w-[20%]"
                    >
                      <Link href={`/buscar?q=${encodeURIComponent(team.name)}`}>
                        <motion.div
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-zinc-900/80 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square border border-zinc-800 hover:border-brand-yellow/50 transition-all duration-300 group"
                        >
                          <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
                            <Image
                              src={team.logo}
                              alt={team.name}
                              fill
                              className="object-contain group-hover:scale-110 transition-transform duration-300"
                              sizes="(max-width: 768px) 80px, 96px"
                            />
                          </div>
                          <h3 className="text-white text-sm md:text-base font-bold text-center group-hover:text-brand-yellow transition-colors">
                            {team.name}
                          </h3>
                        </motion.div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

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
