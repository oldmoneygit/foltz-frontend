'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, Menu, X, ChevronDown, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import PromotionalBanner from './PromotionalBanner'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'

const Header = () => {
  // Theme hook
  const { isDark } = useTheme()

  // Estados locais
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [ligasMenuOpen, setLigasMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef(null)

  // Mock de contadores (substituir por contextos reais depois)
  const cartItemCount = 0
  const wishlistItemCount = 0

  // Itens do menu adaptados para futebol
  const menuItems = [
    { name: 'PREMIER LEAGUE', href: '/liga/premier-league' },
    { name: 'LA LIGA', href: '/liga/la-liga' },
    { name: 'TODAS LAS LIGAS', href: '/ligas', hasSubmenu: true },
    { name: 'SERIE A', href: '/liga/serie-a' },
    { name: 'BUNDESLIGA', href: '/liga/bundesliga' },
    { name: 'COMPRA 1 LLEVA 2', href: '/#bestsellers' },
    { name: 'SEGUIMIENTO', href: '/seguimiento' },
    { name: 'CONTACTO', href: '/contacto' },
  ]

  // Submenu de ligas
  const ligasSubMenu = [
    { name: 'Premier League', href: '/liga/premier-league' },
    { name: 'La Liga', href: '/liga/la-liga' },
    { name: 'Serie A', href: '/liga/serie-a' },
    { name: 'Bundesliga', href: '/liga/bundesliga' },
    { name: 'Ligue 1', href: '/liga/ligue-1' },
    { name: 'Sudamericana', href: '/liga/sul-americana' },
    { name: 'Primera Liga', href: '/liga/primeira-liga' },
    { name: 'Eredivisie', href: '/liga/eredivisie' },
  ]

  // Busca dinâmica
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      // Simulação de busca - substituir por busca real depois
      const mockResults = [
        {
          id: 1,
          name: 'Argentina 1986 Home',
          slug: 'argentina-1986-home',
          image: '/images/seedream/replicate-prediction-a8cg0wdb85rma0ct2cft9fa924.jpg',
          price: 89900,
        },
        {
          id: 2,
          name: 'Real Madrid Visitante 2024',
          slug: 'real-madrid-visitante-2024',
          image: '/images/seedream/replicate-prediction-cw3rbrxqahrme0ct2ckteq99vg.jpg',
          price: 94900,
        },
      ]

      const filtered = mockResults.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(filtered)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  // Click outside para fechar dropdown de busca
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar menu mobile ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      const encodedQuery = encodeURIComponent(searchQuery.trim())
      window.location.href = `/buscar?q=${encodedQuery}`
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      <PromotionalBanner />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl border-b-2 shadow-lg transition-colors duration-300
                   dark:bg-[#0A0A0A] dark:border-white/10 dark:shadow-white/5
                   bg-brand-yellow border-black/30 shadow-black/10"
      >
        {/* TOP BAR - Logo, Search, Cart */}
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between lg:justify-center gap-4 md:gap-6 max-w-7xl mx-auto">

            {/* Mobile Menu Button - Left */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 transition-colors duration-200 order-1
                         dark:text-white dark:hover:text-brand-yellow
                         text-black hover:text-brand-navy"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - Center */}
            <Link href="/" className="flex items-center group flex-shrink-0 order-2 lg:order-1">
              <div className="relative w-32 h-10 md:w-40 md:h-12 transition-all duration-300 group-hover:scale-105">
                <Image
                  src={isDark ? "/images/logo/logo-white.png" : "/images/logo/logo.png"}
                  alt="Foltz Fanwear Logo"
                  fill
                  className="object-contain transition-opacity duration-300"
                  priority
                />
                <div className="absolute inset-0 dark:bg-brand-yellow/5 bg-brand-yellow/0 group-hover:bg-brand-yellow/5 transition-all duration-300 blur-xl" />
              </div>
            </Link>

            {/* Search Bar - Desktop Only */}
            <div className="hidden lg:flex flex-1 max-w-xl order-3 lg:order-2" ref={searchRef}>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar camisas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pr-12 rounded-lg transition-colors duration-200
                             dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-yellow
                             bg-white border-2 border-black/20 text-black placeholder-zinc-500 focus:outline-none focus:border-black"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-0 top-0 h-full px-4 rounded-r-lg transition-colors duration-200
                             dark:bg-brand-yellow dark:text-black dark:hover:bg-brand-yellow/80
                             bg-black text-brand-yellow hover:bg-brand-navy"
                  aria-label="Buscar"
                >
                  <Search size={20} />
                </button>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearchResults && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl overflow-hidden z-50 transition-colors
                                 dark:bg-zinc-900 dark:border-2 dark:border-white/20
                                 bg-white border-2 border-black/30 shadow-black/10"
                    >
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={() => {
                            setShowSearchResults(false)
                            setSearchQuery('')
                          }}
                          className="flex items-center gap-3 px-4 py-3 transition-colors border-b last:border-0
                                     dark:hover:bg-brand-yellow/20 dark:border-white/10
                                     hover:bg-brand-yellow/20 border-zinc-200"
                        >
                          <div className="relative w-12 h-12 rounded flex-shrink-0
                                          dark:bg-zinc-800
                                          bg-zinc-100">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate
                                          dark:text-white
                                          text-black">{product.name}</p>
                            <p className="text-sm font-bold
                                          dark:text-brand-yellow
                                          text-brand-navy">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                      <button
                        onClick={handleSearch}
                        className="w-full px-4 py-3 font-semibold text-sm transition-colors
                                   dark:bg-white/5 dark:hover:bg-white/10 dark:text-white
                                   bg-black/5 hover:bg-black/10 text-black"
                      >
                        Ver todos los resultados para &ldquo;{searchQuery}&rdquo;
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Wishlist & Cart Icons - Right */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 order-3 lg:order-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Wishlist Icon */}
              <Link
                href="/favoritos"
                className="relative p-2 transition-colors duration-200 group
                           dark:text-white dark:hover:text-red-500
                           text-black hover:text-red-500"
                aria-label="Favoritos"
              >
                <Heart size={24} className={wishlistItemCount > 0 ? 'fill-red-500 text-red-500' : ''} />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                href="/carrinho"
                className="relative p-2 transition-colors duration-200
                           dark:text-white dark:hover:text-brand-yellow
                           text-black hover:text-brand-navy"
                aria-label="Carrito de Compras"
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-brand-yellow text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full dark:bg-brand-yellow dark:text-black">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR - Navigation Menu (Desktop Only) */}
        <nav className="hidden lg:block border-t transition-colors
                        dark:border-white/10
                        border-black/20">
          <ul className="container mx-auto px-6 flex items-center justify-center space-x-1 py-3">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasSubmenu && setLigasMenuOpen(true)}
                onMouseLeave={() => item.hasSubmenu && setLigasMenuOpen(false)}
              >
                {item.hasSubmenu ? (
                  <>
                    <button
                      className="flex items-center gap-1.5 px-3 py-2 font-black text-[13px] tracking-wider uppercase transition-colors duration-200
                                 dark:text-white dark:hover:text-brand-yellow
                                 text-black hover:text-brand-navy"
                    >
                      {item.name}
                      <ChevronDown size={16} className={`transition-transform duration-200 ${ligasMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {ligasMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 border-2 rounded-lg shadow-xl py-2 z-50
                                     dark:bg-zinc-900 dark:border-brand-yellow/30 dark:shadow-brand-yellow/10
                                     bg-black border-brand-yellow/30 shadow-brand-yellow/10"
                        >
                          {ligasSubMenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2.5 text-sm font-semibold transition-colors duration-200
                                         dark:text-white dark:hover:bg-brand-yellow/10 dark:hover:text-brand-yellow
                                         text-white hover:bg-brand-yellow/10 hover:text-brand-yellow"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-2 font-black text-[13px] tracking-wider uppercase transition-colors duration-200
                               dark:text-white dark:hover:text-brand-yellow
                               text-black hover:text-brand-navy"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />

              {/* Mobile Menu */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm border-l-2 z-50 lg:hidden overflow-y-auto
                           dark:bg-gradient-to-b dark:from-zinc-900 dark:to-[#0A0A0A] dark:border-brand-yellow/30
                           bg-gradient-to-b from-zinc-900 to-black border-brand-yellow/30"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b border-brand-yellow/20">
                    <span className="text-brand-yellow font-black text-lg uppercase tracking-wider">Menu</span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-white hover:text-brand-yellow transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Mobile Menu Items */}
                  <div className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="w-full"
                      >
                        {item.hasSubmenu ? (
                          <div className="w-full">
                            <button
                              onClick={() => setLigasMenuOpen(!ligasMenuOpen)}
                              className="flex items-center justify-between w-full px-4 py-3 text-white hover:text-brand-yellow text-base font-bold uppercase tracking-wide transition-colors duration-200 hover:bg-brand-yellow/5 rounded-lg"
                            >
                              {item.name}
                              <ChevronDown size={18} className={`transition-transform duration-200 ${ligasMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {ligasMenuOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden ml-4 mt-2 space-y-1"
                                >
                                  {ligasSubMenu.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      href={subItem.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block px-4 py-2 text-white/80 hover:text-brand-yellow text-sm font-medium transition-colors duration-200 hover:bg-brand-yellow/5 rounded-lg"
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-4 py-3 text-white hover:text-brand-yellow text-base font-bold uppercase tracking-wide transition-colors duration-200 hover:bg-brand-yellow/5 rounded-lg"
                          >
                            {item.name}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile Search Bar */}
                  <div className="p-4 border-t border-white/20">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Buscar camisas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 pr-12 rounded-lg transition-colors duration-200
                                   dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-yellow
                                   bg-white border-2 border-black/20 text-black placeholder-zinc-500 focus:outline-none focus:border-black"
                      />
                      <button
                        onClick={handleSearch}
                        className="absolute right-0 top-0 h-full px-4 rounded-r-lg transition-colors duration-200
                                   dark:bg-brand-yellow dark:text-black dark:hover:bg-brand-yellow/80
                                   bg-black text-brand-yellow hover:bg-brand-navy"
                        aria-label="Buscar"
                      >
                        <Search size={20} />
                      </button>
                    </div>

                    {/* Mobile Search Results */}
                    {showSearchResults && searchResults.length > 0 && (
                      <div className="mt-3 border-2 rounded-lg overflow-hidden
                                      dark:bg-zinc-900 dark:border-white/20
                                      bg-white border-black/30">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={() => {
                              setShowSearchResults(false)
                              setSearchQuery('')
                              setMobileMenuOpen(false)
                            }}
                            className="flex items-center gap-3 px-4 py-3 transition-colors border-b last:border-0
                                       dark:hover:bg-brand-yellow/20 dark:border-white/10
                                       hover:bg-brand-yellow/20 border-zinc-200"
                          >
                            <div className="relative w-12 h-12 rounded flex-shrink-0
                                            dark:bg-zinc-800
                                            bg-zinc-100">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate
                                            dark:text-white
                                            text-black">{product.name}</p>
                              <p className="text-sm font-bold
                                            dark:text-brand-yellow
                                            text-brand-navy">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}

export default Header
