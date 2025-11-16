// Sistema de Cache Inteligente - Foltz Fanwear

const CACHE_VERSION = 'v1.1.0'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 horas
const MAX_CACHE_SIZE = 5 * 1024 * 1024 // 5MB máximo

const CACHE_KEYS = {
  PRODUCTS: `foltz_products_${CACHE_VERSION}`,
  IMAGES: `foltz_images_${CACHE_VERSION}`,
  METADATA: `foltz_cache_metadata_${CACHE_VERSION}`,
  CRITICAL_IMAGES: `foltz_critical_images_${CACHE_VERSION}`,
}

export const isCacheValid = (timestamp) => {
  if (!timestamp) return false
  return (Date.now() - timestamp) < CACHE_EXPIRY
}

export const getCacheSize = () => {
  let total = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total
}

export const cleanOldCache = () => {
  if (getCacheSize() > MAX_CACHE_SIZE) {
    clearCache()
  }
}

export const clearCache = () => {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

export const cacheProducts = (products) => {
  try {
    const data = {
      products: products,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    }
    localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(data))
    return true
  } catch (error) {
    clearCache()
    return false
  }
}

export const getCachedProducts = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.PRODUCTS)
    if (!cached) return null

    const data = JSON.parse(cached)

    if (!isCacheValid(data.timestamp)) {
      localStorage.removeItem(CACHE_KEYS.PRODUCTS)
      return null
    }

    return data.products
  } catch (error) {
    return null
  }
}

export const cacheCriticalImage = async (url, key) => {
  try {
    const cached = localStorage.getItem(`${CACHE_KEYS.CRITICAL_IMAGES}_${key}`)
    if (cached) {
      const data = JSON.parse(cached)
      if (isCacheValid(data.timestamp)) {
        return data.dataUrl
      }
    }

    const response = await fetch(url)
    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result

        try {
          const data = {
            dataUrl: dataUrl,
            timestamp: Date.now(),
          }
          localStorage.setItem(`${CACHE_KEYS.CRITICAL_IMAGES}_${key}`, JSON.stringify(data))
        } catch (e) {
          // Quota exceeded - ignore
        }

        resolve(dataUrl)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    return url
  }
}

export const getCachedCriticalImage = (key) => {
  try {
    const cached = localStorage.getItem(`${CACHE_KEYS.CRITICAL_IMAGES}_${key}`)
    if (!cached) return null

    const data = JSON.parse(cached)

    if (!isCacheValid(data.timestamp)) {
      localStorage.removeItem(`${CACHE_KEYS.CRITICAL_IMAGES}_${key}`)
      return null
    }

    return data.dataUrl
  } catch (error) {
    return null
  }
}

export const updateCacheMetadata = () => {
  try {
    const metadata = {
      lastVisit: Date.now(),
      visitCount: getVisitCount() + 1,
      version: CACHE_VERSION,
    }
    localStorage.setItem(CACHE_KEYS.METADATA, JSON.stringify(metadata))
  } catch (error) {
    // Ignore metadata errors
  }
}

export const isFirstVisit = () => {
  try {
    return !localStorage.getItem(CACHE_KEYS.METADATA)
  } catch {
    return true
  }
}

export const getVisitCount = () => {
  try {
    const metadata = localStorage.getItem(CACHE_KEYS.METADATA)
    if (!metadata) return 0
    return JSON.parse(metadata).visitCount || 0
  } catch {
    return 0
  }
}

export const preloadCriticalImages = () => {
  const criticalImages = [
    { url: '/images/hero/hero-v2.jpg', key: 'hero' },
    { url: '/images/logo/logo-white.png', key: 'logo-white' },
    { url: '/images/logo/logo-black.png', key: 'logo-black' },
  ]

  criticalImages.forEach(({ url, key }) => {
    setTimeout(() => {
      cacheCriticalImage(url, key)
    }, 2000)
  })
}

export const getCachedOrFetchProducts = async (fetchFunction) => {
  const cached = getCachedProducts()

  if (cached) {
    setTimeout(async () => {
      try {
        const fresh = await fetchFunction()
        if (fresh && fresh.length > 0) {
          cacheProducts(fresh)
        }
      } catch (error) {
        // Background update failed - ignore
      }
    }, 100)

    return cached
  }

  try {
    const fresh = await fetchFunction()
    if (fresh && fresh.length > 0) {
      cacheProducts(fresh)
    }
    return fresh
  } catch (error) {
    return []
  }
}

export const migrateCache = () => {
  try {
    const oldKeys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('foltz_') && !key.includes(CACHE_VERSION)) {
        oldKeys.push(key)
      }
    }

    oldKeys.forEach(key => localStorage.removeItem(key))
  } catch (error) {
    // Migration failed - ignore
  }
}

if (typeof window !== 'undefined') {
  window.foltzCache = {
    clear: clearCache,
    size: getCacheSize,
    isFirst: isFirstVisit,
    visits: getVisitCount,
    products: getCachedProducts,
  }
}
