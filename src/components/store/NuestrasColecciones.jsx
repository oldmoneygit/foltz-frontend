'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Trophy, Shirt, Star } from 'lucide-react'
import { useStoreMode } from '@/contexts/StoreModeContext'

// Ligas Principales
const ligas = [
  {
    name: 'Premier League',
    slug: 'premier-league',
    image: '/images/teams/premierleague.webp',
    country: 'Inglaterra'
  },
  {
    name: 'La Liga',
    slug: 'la-liga',
    image: '/images/teams/laliga.webp',
    country: 'España'
  },
  {
    name: 'Serie A',
    slug: 'serie-a',
    image: '/images/teams/serieA.webp',
    country: 'Italia'
  },
  {
    name: 'Bundesliga',
    slug: 'bundesliga',
    image: '/images/teams/bundesliga.webp',
    country: 'Alemania'
  },
  {
    name: 'Ligue 1',
    slug: 'ligue-1',
    image: '/images/teams/ligue1.webp',
    country: 'Francia'
  },
  {
    name: 'Brasileirão',
    slug: 'brasileirao',
    image: '/images/teams/brasileirao.webp',
    country: 'Brasil'
  }
]

// Times Internacionais Populares
const timesInternacionais = [
  {
    name: 'Real Madrid',
    slug: 'real-madrid',
    image: '/images/teams/Real_Madrid.png',
    liga: 'La Liga'
  },
  {
    name: 'FC Barcelona',
    slug: 'fc-barcelona',
    image: '/images/teams/FCBarcelona.svg.png',
    liga: 'La Liga'
  },
  {
    name: 'Manchester United',
    slug: 'manchester-united',
    image: '/images/teams/Manchester_United_FC.png',
    liga: 'Premier League'
  },
  {
    name: 'Manchester City',
    slug: 'manchester-city',
    image: '/images/teams/Manchester_City.png',
    liga: 'Premier League'
  },
  {
    name: 'Liverpool',
    slug: 'liverpool',
    image: '/images/teams/liverpool.png',
    liga: 'Premier League'
  },
  {
    name: 'Arsenal',
    slug: 'arsenal',
    image: '/images/teams/Arsenal.png',
    liga: 'Premier League'
  },
  {
    name: 'Chelsea',
    slug: 'chelsea',
    image: '/images/teams/Chelsea.png',
    liga: 'Premier League'
  },
  {
    name: 'AC Milan',
    slug: 'ac-milan',
    image: '/images/teams/milan.png',
    liga: 'Serie A'
  },
  {
    name: 'PSG',
    slug: 'psg',
    image: '/images/teams/PSG.png',
    liga: 'Ligue 1'
  },
  {
    name: 'Inter Miami',
    slug: 'inter-miami',
    image: '/images/teams/Inter-miami.png',
    liga: 'MLS'
  }
]

// Seleções e Clubes Argentinos
const selecoes = [
  {
    name: 'Argentina',
    slug: 'seleccion-argentina',
    image: '/images/teams/argentina-logo.png',
    description: 'Tri Campeón Mundial'
  },
  {
    name: 'Boca Juniors',
    slug: 'boca-juniors',
    image: '/images/teams/boca-juniors-logo.png',
    description: 'La Bombonera'
  },
  {
    name: 'River Plate',
    slug: 'river-plate',
    image: '/images/teams/river-plate-logo.png',
    description: 'El Monumental'
  },
  {
    name: 'Racing Club',
    slug: 'racing-club',
    image: '/images/teams/racing-club.png',
    description: 'La Academia'
  },
  {
    name: 'Independiente',
    slug: 'independiente',
    image: '/images/teams/Independiente.png',
    description: 'Rey de Copas'
  },
  {
    name: 'San Lorenzo',
    slug: 'san-lorenzo',
    image: '/images/teams/San-Lorenzo.png',
    description: 'El Ciclón'
  }
]

const tabs = [
  { id: 'argentina', label: 'Argentina', Icon: Star, collections: selecoes },
  { id: 'clubes', label: 'Clubes', Icon: Shirt, collections: timesInternacionais },
  { id: 'ligas', label: 'Ligas', Icon: Trophy, collections: ligas },
]

// Componente de Carrossel para cada categoria
const CollectionCarousel = ({ collections }) => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 640px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 4 },
        '(min-width: 1280px)': { slidesToScroll: 5 }
      }
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-3 md:gap-4">
        {collections.map((item, index) => (
          <div
            key={`${item.slug}-${index}`}
            className="flex-[0_0_calc(50%-6px)] min-w-0 sm:flex-[0_0_calc(33.333%-10px)] md:flex-[0_0_calc(25%-12px)] lg:flex-[0_0_calc(20%-16px)]"
          >
            <Link href={`/liga/${item.slug}`}>
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                className="relative aspect-[4/3] bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all group backdrop-blur-sm"
              >
                <div className="absolute inset-0 p-2 md:p-3 flex flex-col items-center justify-center">
                  <div className="relative w-full h-12 md:h-14 mb-1.5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-[10px] md:text-xs font-bold text-white text-center mb-0.5 line-clamp-1">
                    {item.name}
                  </h4>
                  {(item.country || item.liga || item.description) && (
                    <p className="text-[9px] md:text-[10px] text-white/50 text-center line-clamp-1">
                      {item.country || item.liga || item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function NuestrasColecciones() {
  const [activeTab, setActiveTab] = useState('ligas')
  const { isRetro } = useStoreMode()

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <section className={`py-12 md:py-16 border-t transition-colors duration-300
                        ${isRetro
                          ? 'bg-[#0D0C0A] border-[#D4AF37]/10'
                          : 'bg-black border-white/5'
                        }`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-2 uppercase tracking-tight
                         ${isRetro ? 'text-[#F5F1E8]' : 'text-white'}`}>
            {isRetro ? 'Equipos Históricos' : 'Nuestras Colecciones'}
          </h2>
          <p className={`text-sm md:text-base
                        ${isRetro ? 'text-[#C4B8A0]/60' : 'text-white/60'}`}>
            {isRetro ? 'Descubre las camisetas retro de los equipos legendarios' : 'Explorá nuestras categorías de jerseys'}
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8"
        >
          {tabs.map((tab) => {
            const IconComponent = tab.Icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all
                  ${activeTab === tab.id
                    ? (isRetro
                        ? 'bg-[#D4AF37] text-[#0D0C0A] shadow-lg shadow-[#D4AF37]/20'
                        : 'bg-white text-black shadow-lg')
                    : (isRetro
                        ? 'bg-[#D4AF37]/10 text-[#F5F1E8] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/20'
                        : 'bg-white/10 text-white border border-white/10 hover:border-white/30 hover:bg-white/20')
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{tab.label}</span>
                </span>

                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-lg -z-10
                               ${isRetro ? 'bg-[#D4AF37]' : 'bg-white'}`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Carousel Content - Animated by Tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <CollectionCarousel collections={activeTabData.collections} />
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-12"
        >
          <Link href="/ligas">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`font-black text-base md:text-lg px-8 py-3 md:py-4 rounded-full shadow-lg transition-all uppercase tracking-wider
                         ${isRetro
                           ? 'bg-[#D4AF37] text-[#0D0C0A] hover:bg-[#E5C158] shadow-[#D4AF37]/20'
                           : 'bg-white text-black hover:bg-gray-200'
                         }`}
            >
              Ver Todas las Colecciones
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
