'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const PIXEL_ID = '2654038074958396'

export default function MetaPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Inicializar Meta Pixel
    if (typeof window !== 'undefined') {
      // Meta Pixel Base Code
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

      // Inicializar pixel
      window.fbq('init', PIXEL_ID)
      window.fbq('track', 'PageView')
    }
  }, [])

  // Track page views quando a rota mudar
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams])

  return (
    <>
      {/* Noscript pixel */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Função helper para rastrear eventos customizados
export const trackEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data)
  }
}

// Eventos específicos
export const trackViewContent = (product) => {
  trackEvent('ViewContent', {
    content_name: product.name || product.title,
    content_ids: [product.id],
    content_type: 'product',
    value: parseFloat(product.price),
    currency: 'BRL',
  })
}

export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('AddToCart', {
    content_name: product.name || product.title,
    content_ids: [product.id],
    content_type: 'product',
    value: parseFloat(product.price) * quantity,
    currency: 'BRL',
    num_items: quantity,
  })
}

export const trackInitiateCheckout = (cartItems, totalValue) => {
  trackEvent('InitiateCheckout', {
    content_ids: cartItems.map((item) => item.id),
    content_type: 'product',
    value: totalValue,
    currency: 'BRL',
    num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  })
}

export const trackSearch = (searchQuery) => {
  trackEvent('Search', {
    search_string: searchQuery,
  })
}
