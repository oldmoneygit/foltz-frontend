'use client'

import { useEffect } from 'react'
import { isFirstVisit, updateCacheMetadata, migrateCache, getVisitCount } from '@/lib/cache'

/**
 * Componente que inicializa o sistema de cache silenciosamente
 * Sem indicadores visuais - apenas funcionalidade interna
 */
const CacheInitializer = () => {
  useEffect(() => {
    // Migra cache de versões antigas
    migrateCache()

    // Atualiza metadata
    updateCacheMetadata()
  }, [])

  // Não renderiza nada visualmente
  return null
}

export default CacheInitializer

