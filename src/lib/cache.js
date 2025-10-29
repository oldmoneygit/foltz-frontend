// Sistema de Cache Inteligente - Foltz Fanwear
// Armazena produtos e imagens no localStorage para carregamento instantâneo

const CACHE_VERSION = 'v1.1.0' // Incrementado para forçar atualização dos preços comparados
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 horas
const MAX_CACHE_SIZE = 5 * 1024 * 1024 // 5MB máximo

// Keys do localStorage
const CACHE_KEYS = {
  PRODUCTS: `foltz_products_${CACHE_VERSION}`,
  IMAGES: `foltz_images_${CACHE_VERSION}`,
  METADATA: `foltz_cache_metadata_${CACHE_VERSION}`,
  CRITICAL_IMAGES: `foltz_critical_images_${CACHE_VERSION}`,
}

/**
 * Verifica se cache está válido (não expirado)
 */
export const isCacheValid = (timestamp) => {
  if (!timestamp) return false
  const now = Date.now()
  return (now - timestamp) < CACHE_EXPIRY
}

/**
 * Obtém tamanho total do cache
 */
export const getCacheSize = () => {
  let total = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total
}

/**
 * Limpa cache antigo se estiver muito grande
 */
export const cleanOldCache = () => {
  const size = getCacheSize()
  if (size > MAX_CACHE_SIZE) {
    console.log('Cache muito grande, limpando...')
    clearCache()
  }
}

/**
 * Limpa todo o cache
 */
export const clearCache = () => {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  console.log('Cache limpo')
}

/**
 * Salva produtos no cache
 */
export const cacheProducts = (products) => {
  try {
    const data = {
      products: products,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    }
    localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(data))
    console.log(`✅ ${products.length} produtos em cache`)
    return true
  } catch (error) {
    console.error('Erro ao cachear produtos:', error)
    // Se der erro (quota exceeded), limpa cache antigo
    clearCache()
    return false
  }
}

/**
 * Obtém produtos do cache
 */
export const getCachedProducts = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.PRODUCTS)
    if (!cached) return null

    const data = JSON.parse(cached)
    
    // Verifica se cache ainda é válido
    if (!isCacheValid(data.timestamp)) {
      console.log('Cache expirado, removendo...')
      localStorage.removeItem(CACHE_KEYS.PRODUCTS)
      return null
    }

    console.log(`✅ ${data.products.length} produtos carregados do cache`)
    return data.products
  } catch (error) {
    console.error('Erro ao ler cache:', error)
    return null
  }
}

/**
 * Cacheia imagem crítica em base64 (hero, logo)
 */
export const cacheCriticalImage = async (url, key) => {
  try {
    // Verifica se já está em cache
    const cached = localStorage.getItem(`${CACHE_KEYS.CRITICAL_IMAGES}_${key}`)
    if (cached) {
      const data = JSON.parse(cached)
      if (isCacheValid(data.timestamp)) {
        return data.dataUrl
      }
    }

    // Baixa e converte para base64
    const response = await fetch(url)
    const blob = await response.blob()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result
        
        // Salva no cache
        try {
          const data = {
            dataUrl: dataUrl,
            timestamp: Date.now(),
          }
          localStorage.setItem(`${CACHE_KEYS.CRITICAL_IMAGES}_${key}`, JSON.stringify(data))
          console.log(`✅ Imagem ${key} cacheada`)
        } catch (e) {
          console.warn('Não foi possível cachear imagem (quota)', e)
        }
        
        resolve(dataUrl)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error(`Erro ao cachear imagem ${key}:`, error)
    return url // Retorna URL original se falhar
  }
}

/**
 * Obtém imagem crítica do cache
 */
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

/**
 * Salva metadados do cache (última visita, etc)
 */
export const updateCacheMetadata = () => {
  try {
    const metadata = {
      lastVisit: Date.now(),
      visitCount: getVisitCount() + 1,
      version: CACHE_VERSION,
    }
    localStorage.setItem(CACHE_KEYS.METADATA, JSON.stringify(metadata))
  } catch (error) {
    console.error('Erro ao salvar metadata:', error)
  }
}

/**
 * Verifica se é primeira visita
 */
export const isFirstVisit = () => {
  try {
    const metadata = localStorage.getItem(CACHE_KEYS.METADATA)
    return !metadata
  } catch {
    return true
  }
}

/**
 * Obtém número de visitas
 */
export const getVisitCount = () => {
  try {
    const metadata = localStorage.getItem(CACHE_KEYS.METADATA)
    if (!metadata) return 0
    const data = JSON.parse(metadata)
    return data.visitCount || 0
  } catch {
    return 0
  }
}

/**
 * Precarrega imagens críticas em background
 */
export const preloadCriticalImages = () => {
  const criticalImages = [
    { url: '/images/hero/hero-v2.jpg', key: 'hero' },
    { url: '/images/logo/logo-white.png', key: 'logo-white' },
    { url: '/images/logo/logo-black.png', key: 'logo-black' },
  ]

  criticalImages.forEach(({ url, key }) => {
    // Carrega em background sem bloquear
    setTimeout(() => {
      cacheCriticalImage(url, key)
    }, 2000) // Após 2s da página carregar
  })
}

/**
 * Estratégia de cache para produtos
 * - Cache-first: Usa cache se disponível
 * - Network-fallback: Busca na API se cache inválido
 * - Background-refresh: Atualiza cache em background
 */
export const getCachedOrFetchProducts = async (fetchFunction) => {
  // 1. Tenta cache primeiro (instantâneo)
  const cached = getCachedProducts()
  
  if (cached) {
    console.log('✅ Usando produtos do cache (instantâneo)')
    
    // 2. Atualiza cache em background (sem bloquear)
    setTimeout(async () => {
      try {
        const fresh = await fetchFunction()
        if (fresh && fresh.length > 0) {
          cacheProducts(fresh)
          console.log('✅ Cache atualizado em background')
        }
      } catch (error) {
        console.log('Erro ao atualizar cache em background:', error)
      }
    }, 100)
    
    return cached
  }
  
  // 3. Se não tem cache, busca da API
  console.log('Primeira visita, buscando produtos...')
  try {
    const fresh = await fetchFunction()
    if (fresh && fresh.length > 0) {
      cacheProducts(fresh)
    }
    return fresh
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}

/**
 * Limpa cache em caso de atualização de versão
 */
export const migrateCache = () => {
  try {
    // Lista todas as keys antigas
    const oldKeys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('foltz_') && !key.includes(CACHE_VERSION)) {
        oldKeys.push(key)
      }
    }
    
    // Remove keys antigas
    oldKeys.forEach(key => localStorage.removeItem(key))
    
    if (oldKeys.length > 0) {
      console.log(`✅ ${oldKeys.length} caches antigos removidos`)
    }
  } catch (error) {
    console.error('Erro ao migrar cache:', error)
  }
}

// Exportar helper para debug
if (typeof window !== 'undefined') {
  window.foltzCache = {
    clear: clearCache,
    size: getCacheSize,
    isFirst: isFirstVisit,
    visits: getVisitCount,
    products: getCachedProducts,
  }
}

