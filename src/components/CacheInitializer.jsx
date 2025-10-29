'use client'

import { useEffect, useState } from 'react'
import { isFirstVisit, updateCacheMetadata, migrateCache, getVisitCount } from '@/lib/cache'
import { Wifi, WifiOff } from 'lucide-react'

/**
 * Componente que inicializa o sistema de cache
 * Mostra um pequeno indicador visual na primeira visita
 */
const CacheInitializer = () => {
  const [showIndicator, setShowIndicator] = useState(false)
  const [isFirst, setIsFirst] = useState(false)
  const [visits, setVisits] = useState(0)

  useEffect(() => {
    // Migra cache de versões antigas
    migrateCache()
    
    // Verifica se é primeira visita
    const first = isFirstVisit()
    setIsFirst(first)
    setVisits(getVisitCount())
    
    // Mostra indicador apenas na segunda visita ou depois
    if (!first && getVisitCount() <= 3) {
      setShowIndicator(true)
      
      // Esconde após 4 segundos
      setTimeout(() => {
        setShowIndicator(false)
      }, 4000)
    }
    
    // Atualiza metadata
    updateCacheMetadata()
    
    // Log informativo
    if (first) {
      console.log('✨ Primeira visita! Otimizando próximas visitas...')
    } else {
      console.log(`✅ Visita #${getVisitCount()} - Cache ativo!`)
    }
  }, [])

  // Não mostrar nada na primeira visita
  if (!showIndicator) return null

  return (
    <div className="fixed top-20 right-6 z-[70] animate-in slide-in-from-top duration-500">
      <div className="bg-green-500/10 border border-green-500/30 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2 shadow-xl">
        <Wifi className="w-4 h-4 text-green-500" />
        <div>
          <p className="text-green-500 text-xs font-bold">Carga Optimizada</p>
          <p className="text-green-400 text-[10px]">Usando caché local</p>
        </div>
      </div>
    </div>
  )
}

export default CacheInitializer

