'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const LEAGUES = [
  {
    name: 'Premier League',
    image: '/images/leagues/premier-league.jpeg',
    searchTerm: 'Premier League',
  },
  {
    name: 'La Liga',
    image: '/images/leagues/la-liga.jpeg',
    searchTerm: 'La Liga',
  },
  {
    name: 'Serie A',
    image: '/images/leagues/serie-a.jpeg',
    searchTerm: 'Serie A',
  },
  {
    name: 'Ligue 1',
    image: '/images/leagues/ligue-1.jpeg',
    searchTerm: 'Ligue 1',
  },
  {
    name: 'Bundesliga',
    image: '/images/leagues/bundesliga.jpeg',
    searchTerm: 'Bundesliga',
  },
  {
    name: 'Eredivisie',
    image: '/images/leagues/eredivisie.jpeg',
    searchTerm: 'Eredivisie',
  },
  {
    name: 'Liga Portugal',
    image: '/images/leagues/primeira-liga.jpeg',
    searchTerm: 'Portugal',
  },
  {
    name: 'Liga MX',
    image: '/images/leagues/liga-mx.jpeg',
    searchTerm: 'Mexico',
  },
  {
    name: 'MLS',
    image: '/images/leagues/mls.jpeg',
    searchTerm: 'MLS',
  },
  {
    name: 'Brasileirão',
    image: '/images/leagues/brasileirao.jpeg',
    searchTerm: 'Brasil',
  },
  {
    name: 'Sul-Americana',
    image: '/images/leagues/sul-americana.jpeg',
    searchTerm: 'Sul Americana',
  },
  {
    name: 'Selecciones',
    image: '/images/leagues/national-teams.jpeg',
    searchTerm: 'National',
  },
]

export default function RetroLeaguesGrid() {
  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            EXPLORA POR LIGA
          </h2>
          <p className="text-gray-400 text-sm">
            Encontrá camisetas retro de las mejores ligas del mundo
          </p>
        </motion.div>

        {/* Leagues Grid - Image Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
          {LEAGUES.map((league, index) => (
            <motion.div
              key={league.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/buscar?q=${encodeURIComponent(league.searchTerm)}`}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group"
                >
                  <Image
                    src={league.image}
                    alt={league.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
