/**
 * Meta Pixel & Conversions API - Utilities
 * Funções auxiliares para tracking completo (client + server)
 */

/**
 * Gera um event_id único para deduplicação
 * Formato: eventName_timestamp_random
 */
export function generateEventId(eventName) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${eventName}_${timestamp}_${random}`
}

/**
 * Hash SHA-256 de um valor (para PII)
 * Normaliza antes: lowercase + trim
 */
export async function hashValue(value) {
  if (!value || typeof value !== 'string') return null

  try {
    // 1. Normalizar
    const normalized = value.toLowerCase().trim()

    // 2. Hash SHA-256
    const encoder = new TextEncoder()
    const data = encoder.encode(normalized)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)

    // 3. Converter para hex
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return hashHex
  } catch (error) {
    return null
  }
}

/**
 * Formata telefone: remove tudo exceto números
 */
export function formatPhone(phone) {
  if (!phone) return null
  return phone.replace(/[^0-9]/g, '')
}

/**
 * Prepara user data com hashing
 * Retorna objeto com campos hasheados em ARRAYS
 */
export async function prepareUserData(userData = {}) {
  const prepared = {}

  // Email
  if (userData.email) {
    const hashed = await hashValue(userData.email)
    if (hashed) prepared.em = [hashed]
  }

  // Phone (limpar antes de hashear)
  if (userData.phone) {
    const cleanPhone = formatPhone(userData.phone)
    if (cleanPhone) {
      const hashed = await hashValue(cleanPhone)
      if (hashed) prepared.ph = [hashed]
    }
  }

  // First Name
  if (userData.firstName) {
    const hashed = await hashValue(userData.firstName)
    if (hashed) prepared.fn = [hashed]
  }

  // Last Name
  if (userData.lastName) {
    const hashed = await hashValue(userData.lastName)
    if (hashed) prepared.ln = [hashed]
  }

  // City
  if (userData.city) {
    const hashed = await hashValue(userData.city)
    if (hashed) prepared.ct = [hashed]
  }

  // State
  if (userData.state) {
    const hashed = await hashValue(userData.state)
    if (hashed) prepared.st = [hashed]
  }

  // ZIP
  if (userData.zip) {
    const hashed = await hashValue(userData.zip)
    if (hashed) prepared.zp = [hashed]
  }

  // Country
  if (userData.country) {
    const hashed = await hashValue(userData.country)
    if (hashed) prepared.country = [hashed]
  }

  return prepared
}

/**
 * Captura Facebook Click ID (fbc) da URL
 * Formato: fb.1.timestamp.fbclid
 */
export function getFacebookClickId() {
  if (typeof window === 'undefined') return null

  try {
    // 1. Verificar URL por parâmetro fbclid
    const urlParams = new URLSearchParams(window.location.search)
    const fbclid = urlParams.get('fbclid')

    if (fbclid) {
      // 2. Montar fbc no formato correto
      const timestamp = Date.now()
      const fbc = `fb.1.${timestamp}.${fbclid}`

      // 3. Salvar em sessionStorage
      sessionStorage.setItem('_fbc', fbc)

      return fbc
    }

    // 4. Tentar recuperar do sessionStorage
    return sessionStorage.getItem('_fbc') || null
  } catch (error) {
    return null
  }
}

/**
 * Captura Facebook Browser ID (fbp) do cookie
 */
export function getFacebookBrowserId() {
  if (typeof window === 'undefined') return null

  try {
    // Procurar cookie _fbp
    const cookies = document.cookie.split(';')
    const fbpCookie = cookies.find(cookie => cookie.trim().startsWith('_fbp='))

    if (fbpCookie) {
      return fbpCookie.split('=')[1]
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * Inicializa parâmetros do Facebook (fbc)
 * Chama uma vez no mount da aplicação
 */
export function initializeFacebookParams() {
  getFacebookClickId() // Captura e salva fbc se presente na URL
}

/**
 * Formata dados de produto para eventos
 */
export function formatProductData(product) {
  if (!product) return {}

  return {
    content_ids: [product.id || product.slug],
    content_name: product.name || product.title,
    content_type: 'product',
    content_category: product.category || product.productType,
    value: parseFloat(product.price) || 0,
    currency: product.currency || 'ARS',
  }
}

/**
 * Formata dados do carrinho para eventos
 */
export function formatCartData(cartItems) {
  if (!cartItems || cartItems.length === 0) return {}

  const contents = cartItems.map(item => ({
    id: item.id || item.slug,
    quantity: item.quantity,
    item_price: parseFloat(item.price),
  }))

  const totalValue = cartItems.reduce((sum, item) =>
    sum + (parseFloat(item.price) * item.quantity), 0
  )

  const totalQuantity = cartItems.reduce((sum, item) =>
    sum + item.quantity, 0
  )

  return {
    content_ids: cartItems.map(item => item.id || item.slug),
    content_type: 'product',
    contents,
    num_items: totalQuantity,
    value: totalValue,
    currency: cartItems[0]?.currency || 'ARS',
  }
}

/**
 * Envia evento para Conversions API (server-side)
 * Fire-and-forget (não bloqueia UX)
 */
export async function sendToConversionsAPI(
  eventName,
  eventData,
  eventId,
  facebookParams = {},
  userData = {}
) {
  if (typeof window === 'undefined') return

  try {
    const payload = {
      eventName,
      eventData,
      eventId,
      fbc: facebookParams.fbc,
      fbp: facebookParams.fbp,
      userData,
      eventTime: Math.floor(Date.now() / 1000),
      sourceUrl: window.location.href,
      userAgent: navigator.userAgent,
    }

    // Fire-and-forget (não aguarda resposta)
    fetch('/api/meta-conversions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true, // Garante envio mesmo se página fechar
    }).catch(err => {
      // Silently fail - don't block UX
    })
  } catch (error) {
    // Silently fail
  }
}

/**
 * Função PRINCIPAL de tracking
 * Envia para Pixel (client) E Conversions API (server)
 */
export async function trackPixelEvent(eventName, eventData = {}, userData = {}) {
  // Validar que pixel está carregado
  if (typeof window === 'undefined' || !window.fbq) {
    return null
  }

  try {
    // 1. Gerar event_id ÚNICO
    const eventId = generateEventId(eventName)

    // 2. Capturar parâmetros do Facebook
    const fbc = getFacebookClickId()
    const fbp = getFacebookBrowserId()

    // 3. Capturar parâmetros UTM
    const { getUTMsForTracking } = await import('./utmTracking')
    const utmParams = getUTMsForTracking()

    // 4. Hashear dados do usuário
    const hashedUserData = await prepareUserData(userData)

    // 5. Montar objeto completo de dados (incluindo UTMs)
    const fullEventData = {
      ...eventData,
      ...(fbc && { fbc }),
      ...(fbp && { fbp }),
      ...utmParams, // Adicionar UTMs aos event data
    }

    // 6. Enviar para Meta Pixel (CLIENT-SIDE)
    if (Object.keys(hashedUserData).length > 0) {
      // Com Advanced Matching
      window.fbq('track', eventName, fullEventData, {
        eventID: eventId,
        ...hashedUserData,
      })
    } else {
      // Sem Advanced Matching
      window.fbq('track', eventName, fullEventData, {
        eventID: eventId,
      })
    }

    // 7. Enviar para Conversions API (SERVER-SIDE)
    sendToConversionsAPI(eventName, fullEventData, eventId, { fbc, fbp }, hashedUserData)

    return eventId
  } catch (error) {
    return null
  }
}
