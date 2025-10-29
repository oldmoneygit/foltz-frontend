// Hook customizado para cache de produtos
// Uso: const { products, isLoading, isFromCache } = useProductCache(fetchFunction)

import { useState, useEffect } from 'react'
import { getCachedOrFetchProducts, updateCacheMetadata, migrateCache, isFirstVisit, preloadCriticalImages } from '@/lib/cache'

export const useProductCache = (fetchFunction) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFromCache, setIsFromCache] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        
        // Migra cache antigo se necessário
        migrateCache()
        
        // Carrega produtos (cache-first strategy)
        const data = await getCachedOrFetchProducts(fetchFunction)
        
        setProducts(data)
        setIsFromCache(!isFirstVisit())
        
        // Atualiza metadata de visita
        updateCacheMetadata()
        
        // Precarrega imagens críticas em background
        if (isFirstVisit()) {
          console.log('✨ Primeira visita! Precarregando recursos...')
          setTimeout(() => {
            preloadCriticalImages()
          }, 3000) // Após 3s
        } else {
          console.log('✨ Bem-vindo de volta! Usando cache...')
        }
        
      } catch (err) {
        console.error('Erro ao carregar produtos:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (fetchFunction) {
      loadProducts()
    }
  }, [fetchFunction])

  return {
    products,
    isLoading,
    isFromCache,
    error,
  }
}

export default useProductCache

