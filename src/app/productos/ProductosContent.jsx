'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid3X3, LayoutGrid, ChevronDown } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'

export default function ProductosContent({ products = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLeague, setSelectedLeague] = useState('all')
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [gridCols, setGridCols] = useState(4)
  const [showFilters, setShowFilters] = useState(false)

  // Get unique leagues from products
  const leagues = useMemo(() => {
    const leagueSet = new Set()
    products.forEach(p => {
      if (p.league?.name) leagueSet.add(p.league.name)
    })
    return Array.from(leagueSet).sort()
  }, [products])

  // Get unique teams from products (extracted from product names)
  const teams = useMemo(() => {
    const teamSet = new Set()
    const teamKeywords = [
      'Boca Juniors', 'River Plate', 'Racing Club', 'Independiente', 'San Lorenzo',
      "Newell's Old Boys", 'Rosario Central', 'Argentina', 'Real Madrid', 'Barcelona',
      'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea', 'Arsenal',
      'PSG', 'AC Milan', 'Inter Milan', 'Juventus', 'Bayern Munich', 'Borussia Dortmund',
      'Portugal', 'Brazil', 'France', 'Germany', 'Spain', 'Italy', 'England'
    ]

    products.forEach(p => {
      const name = (p.name || '').toLowerCase()
      teamKeywords.forEach(team => {
        if (name.includes(team.toLowerCase())) {
          teamSet.add(team)
        }
      })
    })
    return Array.from(teamSet).sort()
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => {
        const name = (p.name || '').toLowerCase()
        const tags = (p.tags || []).join(' ').toLowerCase()
        return name.includes(query) || tags.includes(query)
      })
    }

    // Filter by league
    if (selectedLeague !== 'all') {
      result = result.filter(p => p.league?.name === selectedLeague)
    }

    // Filter by team
    if (selectedTeam !== 'all') {
      result = result.filter(p => {
        const name = (p.name || '').toLowerCase()
        return name.includes(selectedTeam.toLowerCase())
      })
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'name-asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'name-desc':
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
        break
      default:
        // newest - keep original order
        break
    }

    return result
  }, [products, searchQuery, selectedLeague, selectedTeam, sortBy])

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-yellow/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Todos los Productos
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Explora nuestra colección completa de camisetas de fútbol
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/20 text-brand-yellow rounded-lg text-sm font-bold border border-brand-yellow/30">
              {products.length} productos disponibles
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-[70px] z-30 bg-black/95 backdrop-blur-lg border-y border-white/10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-yellow transition-colors"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            </div>

            {/* Filter Toggle Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <Filter size={20} />
              Filtros
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop Filters */}
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-4 w-full md:w-auto`}>
              {/* League Filter */}
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-brand-yellow transition-colors w-full md:w-auto"
              >
                <option value="all">Todas las ligas</option>
                {leagues.map(league => (
                  <option key={league} value={league}>{league}</option>
                ))}
              </select>

              {/* Team Filter */}
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-brand-yellow transition-colors w-full md:w-auto"
              >
                <option value="all">Todos los equipos</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-brand-yellow transition-colors w-full md:w-auto"
              >
                <option value="newest">Más recientes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
              </select>

              {/* Grid Size (Desktop only) */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 rounded ${gridCols === 3 ? 'bg-brand-yellow text-black' : 'bg-white/10 text-white'}`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 rounded ${gridCols === 4 ? 'bg-brand-yellow text-black' : 'bg-white/10 text-white'}`}
                >
                  <LayoutGrid size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-white/60 text-sm">
            Mostrando {filteredProducts.length} de {products.length} productos
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} xl:grid-cols-${gridCols + 1} gap-4 md:gap-6`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.5) }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <Search size={40} className="text-white/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No se encontraron productos
              </h3>
              <p className="text-white/60 mb-6">
                Intenta con otros filtros o términos de búsqueda
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedLeague('all')
                }}
                className="px-6 py-3 bg-brand-yellow hover:bg-brand-yellow/90 text-black font-bold rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
