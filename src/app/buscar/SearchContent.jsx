'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { getCachedOrFetchProducts } from '@/lib/cache'
import { Search, X } from 'lucide-react'

// Função para normalizar texto (remover acentos e caracteres especiais)
const normalizeText = (text) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
}

export default function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(query)

  // Carregar produtos
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const allProducts = await getCachedOrFetchProducts()
        setProducts(allProducts)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filtrar produtos baseado na query ou mostrar todos
  const displayProducts = useMemo(() => {
    // Se não houver query, mostrar TODOS os produtos
    if (!query || query.trim() === '') return products

    const normalizedQuery = normalizeText(query)
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0)

    return products
      .filter(product => {
        const searchText = normalizeText(
          `${product.name || ''} ${product.title || ''} ${product.leagueName || ''} ${(product.tags || []).join(' ')} ${product.productType || ''}`
        )

        // Produto deve conter TODAS as palavras da busca
        return queryWords.every(word => searchText.includes(word))
      })
      .sort((a, b) => {
        // Priorizar matches exatos no nome
        const aName = normalizeText(a.name || a.title || '')
        const bName = normalizeText(b.name || b.title || '')

        const aExactMatch = aName === normalizedQuery
        const bExactMatch = bName === normalizedQuery

        if (aExactMatch && !bExactMatch) return -1
        if (!aExactMatch && bExactMatch) return 1

        // Priorizar matches que começam com a query
        const aStartsWith = aName.startsWith(normalizedQuery)
        const bStartsWith = bName.startsWith(normalizedQuery)

        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1

        return 0
      })
  }, [products, query])

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchInput('')
    router.push('/buscar')
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-black via-brand-navy to-black pt-24 pb-16">
        {/* Header de Busca */}
        <div className="sticky top-20 z-40 bg-black/95 backdrop-blur-md border-b border-brand-yellow/20 py-4 mb-8">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-yellow/60" size={20} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar camisetas, equipos, ligas..."
                  className="w-full pl-12 pr-12 py-4 text-base bg-white/5 border-2 border-brand-yellow/30 rounded-xl
                           text-white placeholder:text-gray-500
                           focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/20
                           transition-all duration-300"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-yellow/60 hover:text-brand-yellow transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </form>

            {/* Resultados Count */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4"
              >
                <p className="text-gray-300 text-sm">
                  {query ? (
                    displayProducts.length > 0 ? (
                      <>
                        Encontramos <span className="font-bold text-brand-yellow">{displayProducts.length}</span> {displayProducts.length === 1 ? 'resultado' : 'resultados'} para <span className="text-white font-semibold">"{query}"</span>
                      </>
                    ) : (
                      <>
                        No encontramos resultados para "<span className="font-semibold text-white">{query}</span>"
                      </>
                    )
                  ) : (
                    <>
                      Mostrando <span className="font-bold text-brand-yellow">{displayProducts.length}</span> productos
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="container mx-auto px-4">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/5 aspect-[3/4] rounded-xl mb-3"></div>
                  <div className="bg-white/5 h-4 rounded mb-2"></div>
                  <div className="bg-white/5 h-4 w-2/3 rounded"></div>
                </div>
              ))}
            </div>
          ) : query && displayProducts.length === 0 ? (
            // Sem resultados
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-wider">
                No encontramos resultados
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Intenta con otros términos o navega por nuestras colecciones
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-4 bg-brand-yellow text-black rounded-xl font-black uppercase tracking-wider
                         hover:bg-brand-yellow/90 transition-all hover:scale-105 duration-300"
              >
                Ver Todas las Colecciones
              </button>
            </motion.div>
          ) : (
            // Resultados (filtrados ou todos)
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <AnimatePresence>
                  {displayProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
                    >
                      <ProductCard
                        product={product}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}








