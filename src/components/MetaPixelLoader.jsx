'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import MetaPixelScript from './MetaPixelScript'
import { initializeFacebookParams, trackPixelEvent } from '@/utils/metaPixelUtils'
import { initializeUTMTracking } from '@/utils/utmTracking'

/**
 * Tracker de PageView (rastreia mudanças de rota)
 */
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Inicializar parâmetros de tracking uma vez
  useEffect(() => {
    initializeFacebookParams() // Captura fbc/fbp
    initializeUTMTracking()    // Captura UTMs
  }, [])

  // Track PageView em toda mudança de rota
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      trackPixelEvent('PageView', {})
    }
  }, [pathname, searchParams])

  return null
}

/**
 * Loader principal do Meta Pixel
 * Carrega script + tracking automático de PageView
 */
export default function MetaPixelLoader() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

  if (!pixelId) {
    return null
  }

  return (
    <>
      <MetaPixelScript pixelId={pixelId} />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
