'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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

  // Filtrar produtos baseado na query
  const filteredProducts = useMemo(() => {
    if (!query || query.trim() === '') return []

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header de Busca */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar camisetas, equipos, ligas..."
                className="w-full pl-12 pr-12 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>

          {/* Resultados Count */}
          {query && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4"
            >
              <p className="text-gray-600">
                {filteredProducts.length > 0 ? (
                  <>
                    Encontramos <span className="font-bold text-blue-600">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'resultado' : 'resultados'} para "{query}"
                  </>
                ) : (
                  <>
                    No encontramos resultados para "<span className="font-semibold">{query}</span>"
                  </>
                )}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : query && filteredProducts.length === 0 ? (
          // Sem resultados
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No encontramos resultados
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Intenta con otros términos o navega por nuestras colecciones
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Ver Todas las Colecciones
            </button>
          </motion.div>
        ) : query && filteredProducts.length > 0 ? (
          // Resultados
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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
        ) : (
          // Estado inicial (sem query)
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">🔎</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              ¿Qué estás buscando?
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Busca por equipo, liga, año o tipo de camiseta
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}


