'use client'

import { useEffect } from 'react'
import { trackViewContent } from './MetaPixel'

export default function ViewContentTracker({ product }) {
  useEffect(() => {
    if (!product) return

    // Prevenir duplicatas
    const productId = product.id || product.slug
    const tracked = sessionStorage.getItem(`viewcontent_${productId}`)

    if (!tracked) {
      trackViewContent(product)
      sessionStorage.setItem(`viewcontent_${productId}`, Date.now().toString())
    }
  }, [product])

  return null
}
