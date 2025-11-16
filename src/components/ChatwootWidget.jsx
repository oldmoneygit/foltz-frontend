'use client'

import { useEffect } from 'react'

const ChatwootWidget = () => {
  useEffect(() => {
    // Carrega o Chatwoot SDK apenas no cliente
    const loadChatwoot = () => {
      const BASE_URL = 'https://app.chatwoot.com'
      const script = document.createElement('script')
      script.src = `${BASE_URL}/packs/js/sdk.js`
      script.async = true
      script.defer = true

      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken: 'YUe2MhoeBmuzETH83xcs182t',
            baseUrl: BASE_URL
          })
        }
      }

      document.body.appendChild(script)
    }

    // Carrega com um pequeno delay para não impactar o carregamento inicial
    const timer = setTimeout(() => {
      loadChatwoot()
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return null
}

export default ChatwootWidget
